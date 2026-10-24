"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = { firstName: string | null; lastName: string | null; email: string };

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/account/profile")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/account");
          return null;
        }
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ customer: Profile }>;
      })
      .then((result) => result && setProfile(result.customer))
      .catch(() => setError("Unable to load your profile. Please try again."));
  }, [router]);
  if (error) return <Message text={error} />;
  if (!profile) return <Message text="Loading your profile..." />;
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Streekala customer";
  return <main className="flex-1 px-4 py-20"><section className="mx-auto max-w-2xl"><p className="text-xs uppercase tracking-[0.22em] text-primary">My profile</p><h1 className="mt-2 text-3xl font-medium">{name}</h1><div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 text-sm"><p><span className="text-muted-foreground">Name: </span>{name}</p><p><span className="text-muted-foreground">Email: </span>{profile.email || "Not available"}</p></div></section></main>;
}

function Message({ text }: { text: string }) {
  return <main className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">{text}</main>;
}
