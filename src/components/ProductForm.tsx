"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { Product } from "@/types/product";

export type ProductFormData = {
  name: string;
  shortDescription: string;
  price: string;
  category: string;
  inStock: boolean;
  imageFile: File | null;
  imagePreview: string;
};

type ProductFormProps = {
  categories: string[];
  initialProduct?: Product | null;
  onCancel: () => void;
  onSave: (product: Product) => void;
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitialFormData(product?: Product | null): ProductFormData {
  return {
    name: product?.name ?? "",
    shortDescription: product?.shortDescription ?? "",
    price: product ? String(product.price) : "",
    category: product?.category ?? "",
    inStock: product?.inStock ?? true,
    imageFile: null,
    imagePreview: product?.image ?? "",
  };
}

export function ProductForm({
  categories,
  initialProduct,
  onCancel,
  onSave,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(() =>
    getInitialFormData(initialProduct),
  );

  const previewUrl = useMemo(() => {
    if (formData.imageFile) {
      return URL.createObjectURL(formData.imageFile);
    }

    return formData.imagePreview;
  }, [formData.imageFile, formData.imagePreview]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateField(
    field: keyof ProductFormData,
    value: string | boolean | File | null,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    updateField("imageFile", selectedFile);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPrice = Number(formData.price);
    if (!normalizedPrice || normalizedPrice <= 0) return;

    // Supabase storage hook point:
    // if (formData.imageFile) {
    //   const filePath = `productos/${crypto.randomUUID()}-${formData.imageFile.name}`;
    //   const { data: uploadData, error: uploadError } = await supabase.storage
    //     .from("productos")
    //     .upload(filePath, formData.imageFile);
    //   if (uploadError) throw uploadError;
    //   imageUrl = supabase.storage.from("productos").getPublicUrl(filePath).data.publicUrl;
    // }

    const productPayload: Product = {
      id: initialProduct?.id ?? createSlug(formData.name),
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      price: normalizedPrice,
      category: formData.category,
      inStock: formData.inStock,
      image: previewUrl || "/images/products/placeholder.jpg",
      options: initialProduct?.options,
    };

    // Supabase database hook point:
    // For create:
    // await supabase.from("productos").insert(productPayload);
    // For edit:
    // await supabase.from("productos").update(productPayload).eq("id", initialProduct.id);

    onSave(productPayload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-semibold text-neutral-800">
            Nombre del producto
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            placeholder="Ej: Remera basica algodon"
          />
        </label>

        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-semibold text-neutral-800">
            Descripcion
          </span>
          <textarea
            required
            minLength={8}
            rows={4}
            value={formData.shortDescription}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="w-full resize-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            placeholder="Descripcion breve para mostrar en el catalogo"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-neutral-800">
            Precio en ARS
          </span>
          <input
            type="number"
            required
            min={1}
            step={1}
            inputMode="numeric"
            value={formData.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            placeholder="12900"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-neutral-800">
            Categoria
          </span>
          <select
            required
            value={formData.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Seleccionar categoria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
          <div className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-white">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Vista previa del producto"
                fill
                unoptimized={previewUrl.startsWith("blob:")}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-xs font-medium text-neutral-400">
                Sin imagen
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Carga de imagen
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Selecciona una imagen desde el dispositivo para previsualizarla.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-700"
            />
          </div>
        </div>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 p-4">
        <span>
          <span className="block text-sm font-semibold text-neutral-900">
            Stock inicial
          </span>
          <span className="block text-sm text-neutral-500">
            Mostrar el producto como disponible en el catalogo.
          </span>
        </span>
        <input
          type="checkbox"
          checked={formData.inStock}
          onChange={(event) => updateField("inStock", event.target.checked)}
          className="h-5 w-5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
        />
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="h-11 rounded-md bg-sky-700 px-5 text-sm font-bold text-white transition hover:bg-sky-800"
        >
          {initialProduct ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
