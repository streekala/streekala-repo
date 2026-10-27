import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Your Streekala Account",
  description:
    "Sign in or create your Streekala account to manage orders, profile details, and saved styles.",
  path: "/account",
  keywords: ["Streekala account", "manage fashion orders"],
  noIndex: true,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
