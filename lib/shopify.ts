
export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION ?? "2026-10";

  if (!domain || (!privateToken && !publicToken)) {
    throw new Error(
      "Missing Shopify environment variables. Set SHOPIFY_STORE_DOMAIN and a Storefront token."
    );
  }

  const headers = new Headers({ "Content-Type": "application/json" });

  if (privateToken) {
    headers.set("Shopify-Storefront-Private-Token", privateToken);
  } else if (publicToken) {
    headers.set("X-Shopify-Storefront-Access-Token", publicToken);
  }

  const response = await fetch(
    `https://${domain}/api/${version}/graphql.json`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(
      result.errors.map((e: { message: string }) => e.message).join(", ")
    );
  }

  return result.data as T;
}
