"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Mode = "login" | "signup";

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const authError = query.get("auth_error");
    if (authError) {
      Promise.resolve().then(() => setError(authError));
      window.history.replaceState({}, "", "/account");
    }
    fetch("/api/account/status", { credentials: "same-origin" })
      .then((response) => response.json() as Promise<{ authenticated: boolean }>)
      .then((result) => setAuthenticated(result.authenticated))
      .catch(() => setError("Unable to check your account."))
      .finally(() => setLoading(false));
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    router.push("/account/authorize?return_to=%2F");
  }

  if (loading) return <main className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">Loading your account...</main>;
  if (authenticated) {
    return (
      <main className="flex-1 px-4 py-20">
        <section className="mx-auto max-w-md space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Your account</p>
          <h1 className="text-3xl font-medium">You are signed in.</h1>
          <a href="/account/logout" className="inline-flex h-8 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">Sign out</a>
        </section>
      </main>
    );
  }

  const login = mode === "login";
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
      <section className="mx-auto max-w-md space-y-8 rounded-xl border border-border bg-card p-6 sm:p-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Welcome to Streekala</p>
          <h1 className="mt-2 text-3xl font-medium">{login ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Shopify securely handles your sign in and email verification.</p>
        </div>
        {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm">
            Email address
            <input required type="email" autoComplete="email" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-ring focus:ring-3 focus:ring-ring/30" placeholder="you@example.com" />
          </label>
          {!login && (
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input required type="checkbox" className="mt-1 accent-primary" />
              I agree to the Terms & Conditions and Privacy Policy.
            </label>
          )}
          <Button type="submit" className="w-full" disabled={authLoading}>{authLoading ? "Opening secure sign in..." : login ? "Sign in with Shopify" : "Create account with Shopify"}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {login ? "New to Streekala?" : "Already have an account?"}{" "}
          <button type="button" className="font-medium text-primary hover:underline" onClick={() => setMode(login ? "signup" : "login")}>{login ? "Create an account" : "Sign in"}</button>
        </p>
      </section>
    </main>
  );
}
