"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

type CartDrawerProps = {
  whatsappPhone: string;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function buildOrderWhatsAppUrl({
  phone,
  lines,
}: {
  phone: string;
  lines: string[];
}) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

export function CartDrawer({ whatsappPhone }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } =
    useCart();

  const orderUrl = useMemo(() => {
    const orderLines = [
      "Hola! Quiero confirmar este pedido:",
      "",
      ...items.flatMap((item) => [
        `${item.quantity} x ${item.name}`,
        `Precio unitario: ${currencyFormatter.format(item.price)}`,
        `Subtotal: ${currencyFormatter.format(item.price * item.quantity)}`,
        "",
      ]),
      `Total: ${currencyFormatter.format(totalPrice)}`,
      "",
      "Quedo atento/a para coordinar pago y entrega. Gracias!",
    ];

    return buildOrderWhatsAppUrl({
      phone: whatsappPhone,
      lines: orderLines,
    });
  }, [items, totalPrice, whatsappPhone]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex min-h-14 items-center justify-center rounded-full bg-[var(--catalog-primary)] px-5 text-sm font-bold text-white shadow-lg shadow-neutral-950/25 transition hover:scale-105 hover:bg-[var(--catalog-primary-hover)]"
        aria-label="Abrir carrito"
      >
        <span>Carrito</span>
        {totalItems > 0 && (
          <span className="ml-2 min-w-6 rounded-full bg-white px-2 py-0.5 text-xs text-neutral-950">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/45"
            aria-label="Cerrar carrito"
            onClick={() => setIsOpen(false)}
          />

          <aside className="absolute bottom-0 right-0 flex h-[88dvh] w-full max-w-md flex-col rounded-t-2xl bg-[var(--catalog-surface)] shadow-2xl sm:bottom-auto sm:top-0 sm:h-full sm:rounded-none">
            <header className="flex items-center justify-between border-b border-[var(--catalog-border)] px-4 py-4">
              <div>
                <h2 className="text-base font-bold text-neutral-950">
                  Tu carrito
                </h2>
                <p className="text-sm text-neutral-500">
                  {totalItems} producto{totalItems === 1 ? "" : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid min-h-10 place-items-center rounded-full border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Cerrar carrito"
              >
                Cerrar
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div className="max-w-56 space-y-2">
                    <p className="text-sm font-semibold text-neutral-950">
                      El carrito esta vacio
                    </p>
                    <p className="text-sm text-neutral-500">
                      Agrega productos para armar el pedido por WhatsApp.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-[var(--catalog-border)] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-950">
                            {item.name}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {currencyFormatter.format(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-sm font-semibold text-neutral-400 transition hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-md border border-neutral-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="grid size-9 place-items-center text-lg font-semibold text-neutral-700"
                            aria-label={`Restar ${item.name}`}
                          >
                            -
                          </button>
                          <span className="grid min-w-10 place-items-center text-sm font-semibold text-neutral-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="grid size-9 place-items-center text-lg font-semibold text-neutral-700"
                            aria-label={`Sumar ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-bold text-neutral-950">
                          {currencyFormatter.format(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--catalog-border)] bg-[var(--catalog-surface)] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">
                  Total
                </span>
                <span className="text-xl font-bold text-neutral-950">
                  {currencyFormatter.format(totalPrice)}
                </span>
              </div>

              <div className="grid gap-2">
                <a
                  href={orderUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={items.length === 0}
                  className={`grid min-h-11 place-items-center rounded-md px-4 text-center text-sm font-bold transition ${
                    items.length === 0
                      ? "pointer-events-none bg-neutral-200 text-neutral-500"
                      : "bg-[var(--catalog-success)] text-white hover:bg-[var(--catalog-success-hover)]"
                  }`}
                >
                  Confirmar Pedido por WhatsApp
                </a>

                <button
                  type="button"
                  onClick={clearCart}
                  disabled={items.length === 0}
                  className="min-h-10 rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300"
                >
                  Vaciar carrito
                </button>
              </div>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
