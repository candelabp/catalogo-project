"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { products as mockProducts } from "@/data/products";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const defaultCategories = [
  "Indumentaria",
  "Bazar",
  "Deco",
  "Papeleria",
  "Accesorios",
];

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    return Array.from(
      new Set([...defaultCategories, ...products.map((product) => product.category)]),
    );
  }, [products]);

  function openCreateForm() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProduct(null);
    setIsFormOpen(false);
  }

  function handleSaveProduct(productToSave: Product) {
    setProducts((currentProducts) => {
      const exists = currentProducts.some(
        (product) => product.id === productToSave.id,
      );

      if (exists) {
        return currentProducts.map((product) =>
          product.id === productToSave.id ? productToSave : product,
        );
      }

      return [productToSave, ...currentProducts];
    });

    closeForm();
  }

  function toggleStock(productId: string) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, inStock: !product.inStock }
          : product,
      ),
    );
  }

  function deleteProduct(productId: string) {
    const shouldDelete = window.confirm(
      "Seguro que queres eliminar este producto?",
    );

    if (!shouldDelete) return;

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  }

  return (
    <main className="min-h-dvh bg-neutral-100 px-4 py-5 text-neutral-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Backoffice
            </p>
            <h1 className="mt-1 text-2xl font-bold text-neutral-950">
              Administracion de productos
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Gestiona precios, categorias, stock y publicaciones del catalogo.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + Agregar Producto
          </button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 px-4 py-3">
              <h2 className="text-sm font-bold text-neutral-950">
                Productos cargados
              </h2>
              <p className="text-sm text-neutral-500">
                {products.length} producto{products.length === 1 ? "" : "s"} en
                total
              </p>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Producto</th>
                    <th className="px-4 py-3 font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductThumb product={product} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-neutral-950">
                              {product.name}
                            </p>
                            <p className="truncate text-sm text-neutral-500">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-neutral-900">
                        {currencyFormatter.format(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StockSwitch
                          checked={product.inStock}
                          onChange={() => toggleStock(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="h-9 rounded-md border border-neutral-300 px-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="h-9 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-neutral-200 md:hidden">
              {products.map((product) => (
                <article key={product.id} className="p-4">
                  <div className="flex gap-3">
                    <ProductThumb product={product} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-neutral-950">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {currencyFormatter.format(product.price)}
                          </p>
                        </div>
                        <StockSwitch
                          checked={product.inStock}
                          onChange={() => toggleStock(product.id)}
                        />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                        {product.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                          {product.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="h-9 rounded-md border border-neutral-300 px-3 text-sm font-semibold text-neutral-700"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="h-9 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside
            className={`rounded-lg border border-neutral-200 bg-white p-4 shadow-sm ${
              isFormOpen ? "block" : "hidden lg:block"
            }`}
          >
            {isFormOpen ? (
              <>
                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    {editingProduct ? "Editar" : "Nuevo producto"}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-neutral-950">
                    {editingProduct
                      ? "Actualizar producto"
                      : "Agregar producto"}
                  </h2>
                </div>
                <ProductForm
                  categories={categories}
                  initialProduct={editingProduct}
                  onCancel={closeForm}
                  onSave={handleSaveProduct}
                />
              </>
            ) : (
              <div className="grid min-h-80 place-items-center text-center">
                <div className="max-w-72">
                  <p className="text-sm font-bold text-neutral-950">
                    Selecciona una accion
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Usa el boton superior para crear un producto o edita uno de
                    la lista.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="56px"
        className="object-cover"
      />
    </div>
  );
}

function StockSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`flex h-8 w-16 items-center rounded-full p-1 transition ${
        checked ? "bg-emerald-600" : "bg-neutral-300"
      }`}
    >
      <span
        className={`grid size-6 place-items-center rounded-full bg-white text-[10px] font-bold shadow-sm transition ${
          checked ? "translate-x-8 text-emerald-700" : "translate-x-0 text-neutral-500"
        }`}
      >
        {checked ? "Si" : "No"}
      </span>
    </button>
  );
}
