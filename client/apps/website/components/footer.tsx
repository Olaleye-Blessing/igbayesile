import { ThemeToggle } from "@ui/components/custom/theme-toggle";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="layout px-4 py-4 flex items-center justify-center">
        <p className="flex items-center justify-center">
          Author:{" "}
          <a
            href="https://www.linkedin.com/in/blessing-olaleye-139a22204/"
            target="_blank"
            rel="noopener"
            className="text-primary font-bold underline"
          >
            Olaleye Blessing
          </a>
          <span>
            <ThemeToggle />
          </span>
        </p>
      </div>
    </footer>
  );
}
