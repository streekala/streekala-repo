import { shopifyFetch } from "@/lib/shopify";

type ShopifyProductsResponse = {
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        featuredImage: {
          url: string;
          altText: string | null;
        } | null;
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        variants: {
          edges: {
            node: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: {
                amount: string;
                currencyCode: string;
              };
            };
          }[];
        };
      };
    }[];
  };
};

export type Product = {
  id: string;
  title: string;
  name: string;
  handle: string;
  description: string;
  image: string;
  imageAlt: string;
  alt: string;
  category: string;
  price: number;
  currency: string;
  variants: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: number;
    currency: string;
  }[];
};

export type ProductDetail = {
  id: string;
  title: string;
  name: string;
  handle: string;
  description: string;
  image: string;
  imageAlt: string;
  images: { src: string; alt: string }[];
  price: number;
  currency: string;
  variants: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: number;
    currency: string;
    selectedOptions: { name: string; value: string }[];
  }[];
};

export async function getProducts(): Promise<Product[]> {
  const query = `
    query GetProducts {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<ShopifyProductsResponse>(query);

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    name: node.title,
    handle: node.handle,
    description: node.description,
    image: node.featuredImage?.url ?? "/images/placeholder.png",
    imageAlt: node.featuredImage?.altText ?? node.title,
    alt: node.featuredImage?.altText ?? node.title,
    category: "Suits",
    price: Number(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    variants: node.variants.edges.map(({ node: variant }) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      price: Number(variant.price.amount),
      currency: variant.price.currencyCode,
    })),
  }));
}



export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  type ProductResponse = {
    product: {
      id: string;
      title: string;
      handle: string;
      description: string;
      images: {
        edges: {
          node: {
            url: string;
            altText: string | null;
          };
        }[];
      };
      priceRange: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
      variants: {
        edges: {
          node: {
            id: string;
            title: string;
            availableForSale: boolean;
            price: {
              amount: string;
              currencyCode: string;
            };
            selectedOptions: {
              name: string;
              value: string;
            }[];
          };
        }[];
      };
    } | null;
  };

  const data = await shopifyFetch<ProductResponse>(query, { handle });

  if (!data.product) return null;

  const product = data.product;

  return {
    id: product.id,
    title: product.title,
    name: product.title,
    handle: product.handle,
    description: product.description,
    image: product.images.edges[0]?.node.url ?? "",
    imageAlt: product.images.edges[0]?.node.altText ?? product.title,
    images: product.images.edges.map(({ node }) => ({
      src: node.url,
      alt: node.altText ?? product.title,
    })),
    price: Number(product.priceRange.minVariantPrice.amount),
    currency: product.priceRange.minVariantPrice.currencyCode,
    variants: product.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      availableForSale: node.availableForSale,
      price: Number(node.price.amount),
      currency: node.price.currencyCode,
      selectedOptions: node.selectedOptions,
    })),
  };
}
