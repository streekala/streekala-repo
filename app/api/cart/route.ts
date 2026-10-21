
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          image: { url: string; altText: string | null } | null;
          price: { amount: string; currencyCode: string };
          product: { title: string; handle: string };
          selectedOptions: { name: string; value: string }[];
        };
      };
    }[];
  };
};

type ApiResult = {
  cartCreate?: { cart: Cart | null; userErrors: { message: string }[] };
  cartLinesAdd?: { cart: Cart | null; userErrors: { message: string }[] };
  cartLinesUpdate?: { cart: Cart | null; userErrors: { message: string }[] };
  cartLinesRemove?: { cart: Cart | null; userErrors: { message: string }[] };
  cart?: Cart | null;
};

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            price { amount currencyCode }
            product { title handle }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function validCartId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("gid://shopify/Cart/")
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = "add", cartId, variantId, quantity, lineId, lineIds } = body;

    let query: string;
    let variables: Record<string, unknown>;

    if (action === "get") {
      if (!validCartId(cartId)) return errorResponse("Invalid cart ID.");

      query = `
        query GetCart($cartId: ID!) {
          cart(id: $cartId) { ${CART_FIELDS} }
        }
      `;
      variables = { cartId };
    } else if (action === "add") {
      if (
        typeof variantId !== "string" ||
        !variantId.startsWith("gid://shopify/ProductVariant/") ||
        !Number.isInteger(quantity ?? 1) ||
        (quantity ?? 1) < 1 ||
        (quantity ?? 1) > 99
      ) {
        return errorResponse("Invalid variant or quantity.");
      }

      if (cartId && !validCartId(cartId)) {
        return errorResponse("Invalid cart ID.");
      }

      if (validCartId(cartId)) {
        query = `
          mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart { ${CART_FIELDS} }
              userErrors { message }
            }
          }
        `;
        variables = {
          cartId,
          lines: [{ merchandiseId: variantId, quantity: quantity ?? 1 }],
        };
      } else {
        query = `
          mutation CreateCart($input: CartInput!) {
            cartCreate(input: $input) {
              cart { ${CART_FIELDS} }
              userErrors { message }
            }
          }
        `;
        variables = {
          input: {
            lines: [{ merchandiseId: variantId, quantity: quantity ?? 1 }],
          },
        };
      }
    } else if (action === "update") {
      if (!validCartId(cartId) || typeof lineId !== "string") {
        return errorResponse("Invalid cart or line ID.");
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return errorResponse("Quantity must be between 1 and 99.");
      }

      query = `
        mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart { ${CART_FIELDS} }
            userErrors { message }
          }
        }
      `;
      variables = { cartId, lines: [{ id: lineId, quantity }] };
    } else if (action === "remove") {
      if (
        !validCartId(cartId) ||
        !Array.isArray(lineIds) ||
        lineIds.length === 0 ||
        !lineIds.every((id: unknown) => typeof id === "string")
      ) {
        return errorResponse("Invalid cart or line IDs.");
      }

      query = `
        mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart { ${CART_FIELDS} }
            userErrors { message }
          }
        }
      `;
      variables = { cartId, lineIds };
    } else {
      return errorResponse("Unsupported cart action.");
    }

    const result = await shopifyFetch<ApiResult>(query, variables);

    const payload =
      result.cartCreate ??
      result.cartLinesAdd ??
      result.cartLinesUpdate ??
      result.cartLinesRemove;

    if (payload) {
      if (payload.userErrors.length > 0) {
        return errorResponse(
          payload.userErrors.map((e) => e.message).join(", ")
        );
      }
      if (!payload.cart) return errorResponse("Shopify returned no cart.", 502);
      return NextResponse.json({ cart: payload.cart });
    }

    if (action === "get") {
      if (!result.cart) return errorResponse("Cart not found.", 404);
      return NextResponse.json({ cart: result.cart });
    }

    return errorResponse("Unexpected Shopify response.", 502);
  } catch (error) {
    console.error("Shopify cart error:", error);
    return errorResponse("Unable to process the cart request.", 500);
  }
}
