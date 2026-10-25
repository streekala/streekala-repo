import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Streekala",
  description: "Learn how Streekala collects, uses, and protects your information.",
};

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you shop with Streekala, we may collect information you provide directly, such as your name, email address, phone number, billing and delivery address, and order details.",
      "We also receive limited technical information, such as your browser type, device information, and pages visited, to keep our website secure and improve your experience.",
    ],
  },
  {
    title: "How we use your information",
    paragraphs: [
      "We use your information to process and deliver orders, provide customer support, communicate about your account or purchases, and maintain our website and services.",
      "Where permitted by law, we may also use your contact details to share news or offers. You can opt out of marketing messages at any time by following the unsubscribe instructions in the message.",
    ],
  },
  {
    title: "Sharing information",
    paragraphs: [
      "We do not sell your personal information. We may share only the information necessary with trusted service providers who help us operate our store, such as payment processors, delivery partners, hosting providers, and analytics services.",
      "We may also disclose information when required by law, to protect our rights, or to prevent fraud and abuse.",
    ],
  },
  {
    title: "Cookies and similar technologies",
    paragraphs: [
      "Our website may use cookies or similar technologies to remember preferences, keep your cart working, understand website usage, and help us improve our services. You can manage cookies through your browser settings, although some features may not work as intended if they are disabled.",
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have the right to request access to, correction of, or deletion of your personal information. You may also object to or restrict certain processing.",
      "To make a privacy request or ask a question, contact us at streekalabydimple7977@gmail.com. We may need to verify your identity before completing a request.",
    ],
  },
  {
    title: "Data security and retention",
    paragraphs: [
      "We use reasonable administrative, technical, and organizational safeguards to protect your information. No online service can be guaranteed completely secure.",
      "We retain information only for as long as needed to provide our services, meet legal and accounting requirements, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The revised version will be posted on this page with a new update date. We encourage you to review it periodically.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Your privacy matters"
      title="Privacy Policy"
      description="This policy explains how Streekala handles the information you share when you visit our website or place an order."
      updated="October 25, 2026"
      sections={sections}
    />
  );
}
