"use client";

import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { SiteNavbar } from "@/components/SiteNavbar";
import { CartProvider } from "@/context/CartContext";
import { fetchProducts } from "@/lib/productsApi";
import type { Product } from "@/types/product";

const STORE_WHATSAPP_PHONE = process.env.NEXT_PUBLIC_PHONE ?? "";

export function CatalogExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const supabaseProducts = await fetchProducts();
        setProducts(supabaseProducts);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los productos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <CartProvider>
      <SiteNavbar />
      <main className="min-h-dvh bg-[var(--catalog-bg)] px-4 py-5 text-[var(--catalog-text)]">
        <section className="mx-auto max-w-5xl">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Catalogo digital
            </p>
            <h1 className="mt-1 text-2xl font-bold">Productos destacados</h1>
          </div>

          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid min-h-72 place-items-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-500">
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="grid min-h-72 place-items-center rounded-lg border border-neutral-200 bg-white px-4 text-center">
              <div>
                <p className="text-sm font-bold text-neutral-950">
                  No hay productos publicados
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Vuelve pronto para ver novedades.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappPhone={STORE_WHATSAPP_PHONE}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <CartDrawer whatsappPhone={STORE_WHATSAPP_PHONE} />
    </CartProvider>
  );
}
