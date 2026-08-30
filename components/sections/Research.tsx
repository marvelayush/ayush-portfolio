import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CertificateIcon } from "@/components/ui/icons";
import { research } from "@/data/research";

export default function Research() {
  return (
    <section
      id="research"
      aria-labelledby="research-h"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading index="04" title="Research & Writing" id="research-h" />
      </Reveal>

      <ul className="mt-10 space-y-3">
        {research.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={Math.min(i * 0.05, 0.15)}>
              <div className="group rounded-xl border border-border bg-surface/40 p-5 transition-colors duration-200 ease-smooth hover:border-fg/25 hover:bg-surface">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-medium leading-relaxed text-fg">
                    {item.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
                    {item.tag}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-accent">
                  {item.venue}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.note}
                </p>

                {item.href || item.certificateUrl ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-muted outline-offset-2 transition-colors duration-200 ease-smooth hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        Related project <span aria-hidden>→</span>
                      </a>
                    ) : null}
                    {item.certificateUrl ? (
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-accent/50 px-2.5 py-1 font-mono text-[11px] text-accent outline-offset-2 transition-transform duration-200 ease-smooth hover:-translate-y-0.5 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        <CertificateIcon />
                        View certificate <span aria-hidden>↗</span>
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
