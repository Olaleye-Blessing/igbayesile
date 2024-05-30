import { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export default function Section({ title, className, children }: SectionProps) {
  return (
    <section className={`cardboard px-6 py-8 my-4 ${className}`}>
      <header>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}
