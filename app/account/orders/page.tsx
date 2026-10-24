"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = { id: string; name: string; createdAt: string; financialStatus: string | null; fulfillmentStatus: string; totalPrice: { amount: string; currencyCode: string } };

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/account/orders")
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/account");
          return null;
        }
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ orders: Order[] }>;
      })
      .then((result) => result && setOrders(result.orders))
      .catch(() => setError("Unable to load your orders. Please try again."));
  }, [router]);
  if (error) return <Message text={error} />;
  if (!orders) return <Message text="Loading your orders..." />;
  return <main className="flex-1 px-4 py-20"><section className="mx-auto max-w-4xl"><p className="text-xs uppercase tracking-[0.22em] text-primary">My orders</p><h1 className="mt-2 text-3xl font-medium">Order history</h1>{orders.length === 0 ? <Message text="You have not placed any orders yet." /> : <div className="mt-8 space-y-4">{orders.map((order) => <article key={order.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-medium">{order.name}</h2><p className="text-sm text-muted-foreground">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(order.createdAt))}</p><p className="mt-2 text-xs text-muted-foreground">{order.financialStatus ?? "Financial status unavailable"} · {order.fulfillmentStatus}</p></div><p className="text-sm font-medium">{new Intl.NumberFormat(undefined, { style: "currency", currency: order.totalPrice.currencyCode }).format(Number(order.totalPrice.amount))}</p></article>)}</div>}</section></main>;
}

function Message({ text }: { text: string }) {
  return <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">{text}</div>;
}
