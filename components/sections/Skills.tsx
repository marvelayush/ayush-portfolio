import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-h"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <Reveal>
        <SectionHeading index="03" title="Skills" id="skills-h">
          Cloud &amp; DevOps includes hands-on Google Cloud Skills Boost work —
          GKE, Terraform-based IaC, and load balancing.
        </SectionHeading>
      </Reveal>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {skills.map((group, i) => (
          <Reveal key={group.label} delay={Math.min(i * 0.05, 0.2)}>
            <div className="grid gap-3 py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                  {group.label}
                </h3>
                {group.note ? (
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    {group.note}
                  </p>
                ) : null}
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
