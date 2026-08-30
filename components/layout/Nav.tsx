"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#research", label: "Research" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Old #github / #work links now land on the merged "Projects" section.
    if (
      window.location.hash === "#github" ||
      window.location.hash === "#work"
    ) {
      history.replaceState(null, "", "#projects");
      document.getElementById("projects")?.scrollIntoView();
    }

    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ease-smooth ${
        scrolled ? "border-border bg-bg/80 backdrop-blur" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-content items-center justify-between px-6 sm:px-8"
      >
        <a
          href="#main"
          className="font-display text-sm font-bold tracking-tight text-fg"
        >
          AN<span className="text-accent">.</span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded px-1.5 py-1.5 text-[11px] transition-colors duration-200 ease-smooth hover:text-fg sm:px-2.5 sm:text-xs ${
                      isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center rounded-full border border-border p-1.5 text-muted outline-offset-2 transition-colors duration-200 ease-smooth hover:border-fg/40 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <InstagramIcon />
          </a>
        </div>
      </nav>
    </header>
  );
}
