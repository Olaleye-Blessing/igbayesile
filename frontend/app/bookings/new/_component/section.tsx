import { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
  title: string;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="cardboard px-4 py-3">
      <header className="mb-2">
        <h3 className="text-lg">{title}</h3>
      </header>
      {children}
    </section>
  );
}
