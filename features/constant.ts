export type Product = {
  id: string;
  image: string;
  alt: string;
  label?: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "loungewear",
    image: "/trending-img-1.webp",
    alt: "Woman wearing a printed loungewear set",
    label: "Loungewear",
    name: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
    price: "₹ 3,499",
    category: "Festive Wear",
  },
  {
    id: "co-ords",
    image: "/trending-img-4.webp",
    alt: "Woman wearing a printed co-ord set",
    label: "Co-ords",
    name: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
    price: "₹ 2,399",
    category: "Daily Casual",
  },
  {
    id: "floral-kurta",
    image: "/trending-img-2.webp",
    alt: "Woman wearing a green floral kurta",
    label: "New",
    name: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
    price: "₹ 5,999",
    category: "Wedding Guest",
  },
  {
    id: "plus-sizes",
    image: "/trending-img-5.webp",
    alt: "Woman wearing a plus size floral kurta",
    label: "Plus Sizes",
    name: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
    price: "₹ 3,499",
    category: "Festive Wear",
  },
  {
    id: "sarees",
    image: "/trending-img-3.webp",
    alt: "Woman wearing an elegant gold saree",
    label: "Sarees",
    name: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
    price: "₹ 2,399",
    category: "Wedding Guest",
  },
];

export const FILTER_OPTIONS = {
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Ivory Whites", "Deep Plums", "Muted Golds", "Soft Blushes"],
  occasions: ["Festive Wear", "Wedding Guest", "Daily Casual"],
} as const;
