"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function SiteNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      if (!supabase) {
        setIsLoadingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (isMounted) {
        setIsAuthenticated(Boolean(data.session));
        setIsLoadingSession(false);
      }
    }

    loadSession();

    const { data: listener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session));
        setIsLoadingSession(false);
      }) ?? {};

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase?.auth.signOut();
    setIsAuthenticated(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="min-w-0">
          <span className="block truncate text-sm font-bold uppercase tracking-wide text-neutral-950">
            Catalogo Digital
          </span>
          <span className="block truncate text-xs text-neutral-500">
            Comercio local
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden h-10 place-items-center rounded-md px-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 sm:grid"
          >
            Inicio
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/admin/dashboard"
                className="grid h-10 place-items-center rounded-md bg-sky-700 px-3 text-sm font-bold text-white transition hover:bg-sky-800"
              >
                Panel
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="h-10 rounded-md border border-neutral-300 px-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              aria-disabled={isLoadingSession}
              className="grid h-10 place-items-center rounded-md bg-neutral-950 px-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Ingresar admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
