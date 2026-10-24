
import "server-only";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_PUBLIC_TOKEN =
  process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

export type SearchProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

type SearchResponse = {
  data?: {
    search: {
      edges: Array<{
        node: SearchProduct;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
};

export async function searchProducts(
  searchTerm: string,
): Promise<SearchProduct[]> {
  const term = searchTerm.trim();

  if (!term) return [];

  if (
    !SHOPIFY_STORE_DOMAIN ||
    !SHOPIFY_STOREFRONT_PUBLIC_TOKEN ||
    !SHOPIFY_API_VERSION
  ) {
    throw new Error("Shopify Storefront API environment variables are missing.");
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          SHOPIFY_STOREFRONT_PUBLIC_TOKEN,
      },
      body: JSON.stringify({
        query: SEARCH_PRODUCTS_QUERY,
        variables: {
          query: term,
          first: 24,
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify search failed with status ${response.status}.`);
  }

  const result = (await response.json()) as SearchResponse;

  if (result.errors?.length) {
    console.error("Shopify search errors:", result.errors);
    throw new Error("Unable to search Shopify products.");
  }

  return result.data?.search.edges.map((edge) => edge.node) ?? [];
}
