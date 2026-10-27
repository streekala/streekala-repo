import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Review the terms that apply when you use the Streekala website, place an order, and shop our women's fashion.",
  path: "/terms",
  keywords: ["Streekala terms and conditions", "online shopping terms"],
});

const sections: LegalSection[] = [
  {
    title: "Welcome to Streekala",
    paragraphs: [
      "These Terms & Conditions apply to your use of the Streekala website and to purchases made through it. By browsing our website or placing an order, you agree to these terms.",
      "If you do not agree with these terms, please do not use the website or place an order.",
    ],
  },
  {
    title: "Products and availability",
    paragraphs: [
      "We aim to display product descriptions, colors, and images as accurately as possible. Your screen and device may affect how colors appear. Product availability, sizing, and details may change without notice.",
      "We reserve the right to limit quantities, refuse an order, or discontinue a product when necessary. If we cannot fulfill an accepted order, we will contact you and refund any payment received for the unavailable item.",
    ],
  },
  {
    title: "Orders and payment",
    paragraphs: [
      "An order is submitted when you complete checkout. We will send an order confirmation, but this does not guarantee that an order has been accepted. An order is accepted when we dispatch the products or otherwise confirm acceptance.",
      "You agree to provide accurate billing, delivery, and contact information. Prices and applicable taxes are shown at checkout. Payments are processed through our authorized payment providers, and we do not store complete payment card details.",
    ],
  },
  {
    title: "Shipping and returns",
    paragraphs: [
      "Delivery estimates are provided for guidance and may be affected by carrier delays, weather, customs, or circumstances outside our control. Risk in an order passes to you when it is delivered to the address provided at checkout.",
      "Returns and exchanges are subject to our applicable shipping and returns policy. Please inspect your order promptly and contact us at streekalabydimple7977@gmail.com if it arrives damaged or incorrect.",
    ],
  },
  {
    title: "Acceptable use",
    paragraphs: [
      "You may use this website only for lawful purposes. You must not interfere with the website, attempt unauthorized access, introduce malicious code, scrape content in a way that harms the service, or use another person’s information without permission.",
    ],
  },
  {
    title: "Intellectual property",
    paragraphs: [
      "The Streekala name, logo, product photography, copy, design, and other website content belong to Streekala or our licensors. You may view the content for personal, non-commercial use only. You may not copy, modify, distribute, or use it without our prior written permission.",
    ],
  },
  {
    title: "Disclaimer and limitation of liability",
    paragraphs: [
      "We provide the website and its content on an as-available basis and do not promise that it will always be uninterrupted, error-free, or free of harmful components. Nothing in these terms limits rights that cannot legally be limited.",
      "To the extent permitted by law, Streekala will not be responsible for indirect, incidental, or consequential losses arising from your use of the website or products.",
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [
      "We may update these terms when our services or legal obligations change. The latest version will always be available on this page, with the update date shown above.",
      "Questions about these terms can be sent to streekalabydimple7977@gmail.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Shopping with confidence"
      title="Terms & Conditions"
      description="These terms help keep the Streekala shopping experience clear, fair, and safe for everyone."
      updated="October 25, 2026"
      sections={sections}
    />
  );
}
