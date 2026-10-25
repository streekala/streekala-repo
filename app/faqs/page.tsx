import type { Metadata } from "next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "FAQs | Streekala",
  description: "Find answers to common questions about Streekala products, orders, shipping, and returns.",
};

const faqs = [
  {
    question: "What makes Streekala pieces special?",
    answer:
      "Every Streekala piece is thoughtfully selected and designed to bring together contemporary style, comfort, and timeless details for your everyday wardrobe.",
  },
  {
    question: "How do I choose the right size?",
    answer:
      "Please check the size information on each product page before ordering. If you are between sizes or need help, email us at streekalabydimple7977@gmail.com and our team will be happy to guide you.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually dispatched within 2–4 business days. Delivery times vary by destination, and you will receive tracking details once your order has been shipped.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "We currently focus on delivering within India. If you are outside India and would like to place an order, please contact us so we can check the available options.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Contact us as soon as possible after placing your order. We can make changes or cancel an order only while it has not entered processing or dispatch.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "Eligible items can be returned or exchanged in their original, unused condition within the period stated in our shipping and returns policy. Please contact us before sending anything back.",
  },
  {
    question: "How should I care for my Streekala products?",
    answer:
      "Care instructions vary by fabric and are included on the product page or garment label. Following those instructions helps preserve the color, shape, and finish of your piece.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is dispatched, we will email you the tracking information. You can use that link to follow your delivery with the courier.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Available payment methods are shown securely during checkout. Your complete payment card details are processed by our authorized payment provider and are not stored by Streekala.",
  },
  {
    question: "How can I contact Streekala?",
    answer:
      "For help with products, orders, or styling, email streekalabydimple7977@gmail.com or use our contact page. We will get back to you as soon as possible.",
  },
] as const;

export default function FaqsPage() {
  return (
    <main>
      <Container className="mx-auto">
        <div className="w-full">
          <header className="mx-auto max-w-3xl border-b border-border pb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              We are here to help
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Everything you need to know about finding, ordering, and caring
              for your Streekala favorites.
            </p>
          </header>

          <section className="mx-auto mt-10 max-w-3xl p-5 sm:p-8">
            <Accordion className="divide-y divide-border" defaultValue={["item-0"]}>
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger className="py-5 text-base font-medium text-foreground hover:no-underline sm:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pr-8 text-sm leading-7 text-muted-foreground sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </Container>
    </main>
  );
}