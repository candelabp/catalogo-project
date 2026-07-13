import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-100 px-4 py-8 text-neutral-950">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            Backoffice
          </p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-950">
            Iniciar sesion
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Acceso exclusivo para administrar el catalogo digital.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
