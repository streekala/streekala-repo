import { Container } from "@/components/container";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <main>
      <Container className="mx-auto">
        <div className="w-full">
          <header className="mx-auto max-w-3xl border-b border-border pb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {updated}
            </p>
          </header>

          <div className="mx-auto max-w-3xl divide-y divide-border">
            {sections.map((section) => (
              <section key={section.title} className="py-8 first:pt-10">
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
