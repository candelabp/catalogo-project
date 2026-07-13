"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        "Faltan las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        "No pudimos iniciar sesion. Revisa el email y la contrasena.",
      );
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-neutral-800">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={(event) =>
            setFormData((currentData) => ({
              ...currentData,
              email: event.target.value,
            }))
          }
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 invalid:border-red-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          placeholder="admin@negocio.com"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-neutral-800">
          Contrasena
        </span>
        <input
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          value={formData.password}
          onChange={(event) =>
            setFormData((currentData) => ({
              ...currentData,
              password: event.target.value,
            }))
          }
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 invalid:border-red-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          placeholder="Tu contrasena"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-md bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {isSubmitting ? "Ingresando..." : "Ingresar al panel"}
      </button>
    </form>
  );
}
