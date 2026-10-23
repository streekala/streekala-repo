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
              compareAtPrice: {
                amount: string;
                currencyCode: string;
              } | null;
            };
          }[];
        };
      };
    }[];
  };
};

type ShopifyCollectionsResponse = {
  collections: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        image: {
          url: string;
          altText: string | null;
        } | null;
      };
    }[];
  };
};

type ShopifyCollectionProductsResponse = {
  collection: {
    title: string;
    description: string;
    products: ShopifyProductsResponse["products"];
  } | null;
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
  compareAtPrice: number | null;
  discountPercentage: number | null;
  variants: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: number;
    currency: string;
    compareAtPrice: number | null;
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

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  imageAlt: string;
};

export async function getCollections(first = 3): Promise<Collection[]> {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<ShopifyCollectionsResponse>(query, { first });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    image: node.image?.url ?? "/images/placeholder.png",
    imageAlt: node.image?.altText ?? node.title,
  }));
}

export async function getProducts(collectionHandle?: string): Promise<Product[]> {
  const query = `
    query GetProducts($query: String) {
      products(first: 20, query: $query) {
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
                  compareAtPrice {
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

  const data = await shopifyFetch<ShopifyProductsResponse>(query, {
    query: collectionHandle ? `collection:${collectionHandle}` : undefined,
  });

  return data.products.edges.map(({ node }) => {
    const price = Number(node.priceRange.minVariantPrice.amount);
    const compareAtPrice = node.variants.edges.reduce<number | null>(
      (highestCompareAtPrice, { node: variant }) => {
        const variantCompareAtPrice = variant.compareAtPrice
          ? Number(variant.compareAtPrice.amount)
          : null;

        if (variantCompareAtPrice === null) return highestCompareAtPrice;
        return highestCompareAtPrice === null
          ? variantCompareAtPrice
          : Math.max(highestCompareAtPrice, variantCompareAtPrice);
      },
      null
    );

    return {
    id: node.id,
    title: node.title,
    name: node.title,
    handle: node.handle,
    description: node.description,
    image: node.featuredImage?.url ?? "/images/placeholder.png",
    imageAlt: node.featuredImage?.altText ?? node.title,
    alt: node.featuredImage?.altText ?? node.title,
    category: "Suits",
    price,
    currency: node.priceRange.minVariantPrice.currencyCode,
    compareAtPrice,
    discountPercentage:
      compareAtPrice && compareAtPrice > price
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : null,
    variants: node.variants.edges.map(({ node: variant }) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      price: Number(variant.price.amount),
      currency: variant.price.currencyCode,
      compareAtPrice: variant.compareAtPrice
        ? Number(variant.compareAtPrice.amount)
        : null,
    })),
    };
  });
}

export async function getCollectionByHandle(handle: string): Promise<{
  title: string;
  description: string;
  products: Product[];
} | null> {
  const query = `
    query GetCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        description
        products(first: 250) {
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
                    compareAtPrice {
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
    }
  `;

  const data = await shopifyFetch<ShopifyCollectionProductsResponse>(query, {
    handle,
  });

  if (!data.collection) return null;

  return {
    title: data.collection.title,
    description: data.collection.description,
    products: data.collection.products.edges.map(({ node }) => {
      const price = Number(node.priceRange.minVariantPrice.amount);
      const compareAtPrice = node.variants.edges.reduce<number | null>(
        (highestCompareAtPrice, { node: variant }) => {
          const variantCompareAtPrice = variant.compareAtPrice
            ? Number(variant.compareAtPrice.amount)
            : null;

          if (variantCompareAtPrice === null) return highestCompareAtPrice;
          return highestCompareAtPrice === null
            ? variantCompareAtPrice
            : Math.max(highestCompareAtPrice, variantCompareAtPrice);
        },
        null
      );

      return {
      id: node.id,
      title: node.title,
      name: node.title,
      handle: node.handle,
      description: node.description,
      image: node.featuredImage?.url ?? "/images/placeholder.png",
      imageAlt: node.featuredImage?.altText ?? node.title,
      alt: node.featuredImage?.altText ?? node.title,
      category: "Suits",
      price,
      currency: node.priceRange.minVariantPrice.currencyCode,
      compareAtPrice,
      discountPercentage:
        compareAtPrice && compareAtPrice > price
          ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
          : null,
      variants: node.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        price: Number(variant.price.amount),
        currency: variant.price.currencyCode,
        compareAtPrice: variant.compareAtPrice
          ? Number(variant.compareAtPrice.amount)
          : null,
      })),
      };
    }),
  };
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
