"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
  whatsappPhone: string;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function buildProductWhatsAppUrl(product: Product, phone: string) {
  const message = [
    "Hola! Quiero consultar por este producto:",
    "",
    `Producto: ${product.name}`,
    `Precio: ${currencyFormatter.format(product.price)}`,
    `Categoria: ${product.category}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message,
  )}`;
}

export function ProductCard({ product, whatsappPhone }: ProductCardProps) {
  const { addItem } = useCart();
  const productWhatsAppUrl = buildProductWhatsAppUrl(product, whatsappPhone);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[var(--catalog-border)] bg-[var(--catalog-surface)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-[var(--catalog-surface-muted)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-neutral-700 shadow-sm">
          {product.category}
        </span>

        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-neutral-950/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900">
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-950 sm:text-base">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">
            {product.shortDescription}
          </p>
        </div>

        {product.options?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {product.options.map((option) => (
              <span
                key={option.name}
                className="rounded-full bg-[var(--catalog-surface-muted)] px-2 py-1 text-[11px] font-medium text-[var(--catalog-muted)]"
              >
                {option.name}: {option.values.join(", ")}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-bold text-neutral-950 sm:text-lg">
              {currencyFormatter.format(product.price)}
            </p>
            <p
              className={`text-[11px] font-semibold ${
                product.inStock ? "text-[var(--catalog-success)]" : "text-neutral-400"
              }`}
            >
              {product.inStock ? "Disponible" : "No disponible"}
            </p>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => addItem(product)}
              disabled={!product.inStock}
              className="min-h-10 rounded-md bg-[var(--catalog-primary)] px-3 text-sm font-semibold text-white transition hover:bg-[var(--catalog-primary-hover)] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            >
              Agregar al carrito
            </button>

            <a
              href={productWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="grid min-h-10 place-items-center rounded-md border border-neutral-300 px-3 text-center text-sm font-semibold text-neutral-800 transition hover:border-neutral-950 hover:bg-neutral-50"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
