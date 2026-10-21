import { connection, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

export const instant = false;

export async function GET() {
  await connection();

  try {
    const data = await shopifyFetch<{
      products: {
        edges: {
          node: {
            id: string;
            title: string;
            handle: string;
          };
        }[];
      };
    }>(`
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `);

    return NextResponse.json(data.products.edges.map(({ node }) => node));
  } catch (error) {
    console.error("Shopify test failed:", error);
    return NextResponse.json(
      { error: "Shopify request failed. Check server logs and API configuration." },
      { status: 500 }
    );
  }
}
