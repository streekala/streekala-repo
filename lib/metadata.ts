import type { Metadata } from "next";

export const SITE_URL = "https://streekala.co.in";
export const SITE_NAME = "Streekala";
export const DEFAULT_DESCRIPTION =
  "Discover thoughtfully designed women's fashion from Streekala, blending contemporary style, comfort, and timeless Indian details.";
export const DEFAULT_KEYWORDS = [
  "women's fashion",
  "Indian fashion",
  "women's clothing",
  "Streekala",
  "online fashion India",
];
export const DEFAULT_IMAGE = "/opengraph-image.png";

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  imageAlt = "Streekala women's fashion",
  noIndex = false,
}: MetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          alt: imageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
