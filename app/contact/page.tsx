import type { Metadata } from "next";
import { IconClock, IconMail, IconMapPin } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Streekala",
  description:
    "Get in touch with Streekala for help with products, orders, sizing, styling, and your shopping experience.",
  path: "/contact",
  keywords: ["contact Streekala", "Streekala customer support", "fashion styling help"],
});

const contactDetails = [
  {
    icon: IconMail,
    label: "Email us",
    value: "streekalabydimple7977@gmail.com",
    href: "mailto:streekalabydimple7977@gmail.com",
  },
  {
    icon: IconMapPin,
    label: "Visit our studio",
    value: "Streekala Studio, Ahmedabad, Gujarat, India",
  },
  {
    icon: IconClock,
    label: "Opening hours",
    value: "Monday – Saturday, 10:00 AM – 6:00 PM",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Container className="mx-auto">
        <div className="w-full">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              We would love to hear from you
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Let&apos;s stay in touch
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Have a question about a piece, your order, or finding your
              perfect look? Send us a message and our team will be in touch.
            </p>
          </header>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="border border-primary p-7 text-foreground sm:p-9">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                Contact details
              </p>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                We&apos;re here for you.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Reach out for personal help with your Streekala experience.
                We&apos;ll do our best to reply within one business day.
              </p>

              <div className="mt-10 space-y-7">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 text-primary">
                      <Icon size={19} stroke={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {label}
                      </p>
                      {href ? (
                        <a
                          className="mt-1 block break-words text-sm leading-6 transition-colors hover:text-secondary"
                          href={href}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-foreground">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <form className="border border-border bg-card p-6 shadow-sm sm:p-9">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="bg-background px-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-background px-3"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="How can we help?"
                  required
                  rows={7}
                  className="flex min-h-35 w-full resize-y border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <Button type="submit" size="lg" className="mt-7 w-full">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}