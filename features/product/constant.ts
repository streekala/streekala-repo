export type ProductImage = {
  src: string;
  alt: string;
};

export type Accessory = {
  image: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
};

export const productImages: ProductImage[] = [
  { src: "/trending-img-5.webp", alt: "Regal magenta silk saree styled on a model" },
  { src: "/trending-img-1.webp", alt: "Blue ethnic outfit detail" },
  { src: "/trending-img-2.webp", alt: "Printed festive outfit detail" },
  { src: "/trending-img-3.webp", alt: "Contemporary Indian outfit detail" },
];

export const accessories: Accessory[] = [
  {
    image: "/new-arrivals-1.webp",
    name: "Kundan Polki Choker Set",
    description: "Gold Plated Brass",
    price: "₹ 4,500",
  },
  {
    image: "/new-arrivals-2.webp",
    name: "Pearl Droplet Jhumkas",
    description: "Statement Earrings",
    price: "₹ 1,850",
    badge: "NEW",
  },
  {
    image: "/new-arrivals-3.webp",
    name: "Zardozi Embroidered Potli",
    description: "Handcrafted Accessory",
    price: "₹ 2,200",
  },
  {
    image: "/trending-img-4.webp",
    name: "Antique Gold Bangle Set",
    description: "Set of 12",
    price: "₹ 950",
  },
];
