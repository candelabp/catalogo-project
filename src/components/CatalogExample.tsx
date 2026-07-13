"use client";

import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { CartProvider } from "@/context/CartContext";
import { products } from "@/data/products";

const STORE_WHATSAPP_PHONE = "5491112345678";

export function CatalogExample() {
  return (
    <CartProvider>
      <main className="min-h-dvh bg-[var(--catalog-bg)] px-4 py-5 text-[var(--catalog-text)]">
        <section className="mx-auto max-w-5xl">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Catalogo digital
            </p>
            <h1 className="mt-1 text-2xl font-bold">Productos destacados</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappPhone={STORE_WHATSAPP_PHONE}
              />
            ))}
          </div>
        </section>
      </main>

      <CartDrawer whatsappPhone={STORE_WHATSAPP_PHONE} />
    </CartProvider>
  );
}
