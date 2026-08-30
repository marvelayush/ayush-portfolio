import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import CopyButton from "@/components/ui/CopyButton";
import { GitHubIcon, InstagramIcon } from "@/components/ui/icons";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-h"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading index="05" title="Contact" id="contact-h">
          Open to backend and applied-AI internships and research
          collaborations. Email is the fastest way to reach me.
        </SectionHeading>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-accent bg-accent px-5 py-2.5 text-sm text-accent-fg transition-transform duration-200 ease-smooth hover:-translate-y-0.5"
          >
            {site.email}
          </a>
          <CopyButton value={site.email} />
        </div>

        <div className="mt-6 flex flex-wrap gap-5 font-mono text-xs text-muted">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 ease-smooth hover:text-fg"
          >
            <GitHubIcon />
            github.com/marvelayush ↗
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 ease-smooth hover:text-fg"
          >
            linkedin.com/in/ayush-narayan-bmsce2004 ↗
          </a>
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 ease-smooth hover:text-fg"
          >
            <InstagramIcon />
            instagram.com/aayush._.n ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
