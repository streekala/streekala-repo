import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Your Streekala Orders",
  description: "View your Streekala order history and delivery details.",
  path: "/account/orders",
  noIndex: true,
});

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
