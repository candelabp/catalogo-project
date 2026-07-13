import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

const PRODUCT_IMAGES_BUCKET = "imagenes-productos";

export type ProductSaveInput = {
  name: string;
  shortDescription: string;
  price: number;
  category: string;
  inStock: boolean;
  imageFile: File | null;
  imagePreview: string;
};

type ProductoRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number | string;
  imagen_url: string | null;
  categoria: string;
  stock: boolean;
  created_at: string;
};

function assertSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase no esta configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return supabase;
}

export function mapProductoToProduct(producto: ProductoRow): Product {
  return {
    id: producto.id,
    name: producto.nombre,
    shortDescription: producto.descripcion ?? "",
    price: Number(producto.precio),
    image: producto.imagen_url ?? "/images/products/placeholder.svg",
    category: producto.categoria,
    inStock: producto.stock,
  };
}

async function uploadProductImage(file: File) {
  const client = assertSupabaseClient();
  const safeFileName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filePath = `${crypto.randomUUID()}-${safeFileName}`;

  const { error } = await client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

export async function fetchProducts() {
  const client = assertSupabaseClient();
  const { data, error } = await client
    .from("productos")
    .select("id,nombre,descripcion,precio,imagen_url,categoria,stock,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((producto) =>
    mapProductoToProduct(producto as ProductoRow),
  );
}

export async function createProduct(input: ProductSaveInput) {
  const client = assertSupabaseClient();
  const imageUrl = input.imageFile
    ? await uploadProductImage(input.imageFile)
    : input.imagePreview || null;

  const { data, error } = await client
    .from("productos")
    .insert({
      nombre: input.name,
      descripcion: input.shortDescription,
      precio: input.price,
      imagen_url: imageUrl,
      categoria: input.category,
      stock: input.inStock,
    })
    .select("id,nombre,descripcion,precio,imagen_url,categoria,stock,created_at")
    .single();

  if (error) throw error;

  return mapProductoToProduct(data as ProductoRow);
}

export async function updateProduct(productId: string, input: ProductSaveInput) {
  const client = assertSupabaseClient();
  const imageUrl = input.imageFile
    ? await uploadProductImage(input.imageFile)
    : input.imagePreview || null;

  const { data, error } = await client
    .from("productos")
    .update({
      nombre: input.name,
      descripcion: input.shortDescription,
      precio: input.price,
      imagen_url: imageUrl,
      categoria: input.category,
      stock: input.inStock,
    })
    .eq("id", productId)
    .select("id,nombre,descripcion,precio,imagen_url,categoria,stock,created_at")
    .single();

  if (error) throw error;

  return mapProductoToProduct(data as ProductoRow);
}

export async function updateProductStock(productId: string, inStock: boolean) {
  const client = assertSupabaseClient();
  const { data, error } = await client
    .from("productos")
    .update({ stock: inStock })
    .eq("id", productId)
    .select("id,nombre,descripcion,precio,imagen_url,categoria,stock,created_at")
    .single();

  if (error) throw error;

  return mapProductoToProduct(data as ProductoRow);
}

export async function deleteProductById(productId: string) {
  const client = assertSupabaseClient();
  const { error } = await client.from("productos").delete().eq("id", productId);

  if (error) throw error;
}
