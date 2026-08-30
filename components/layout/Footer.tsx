import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-content px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] text-faint">
          © {new Date().getFullYear()} {site.name} · Built with Next.js, R3F &amp;
          Framer Motion
        </p>
        <div className="flex gap-5 font-mono text-[11px] text-muted">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 ease-smooth hover:text-fg"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 ease-smooth hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={site.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 ease-smooth hover:text-fg"
          >
            Résumé
          </a>
        </div>
      </div>
    </footer>
  );
}
