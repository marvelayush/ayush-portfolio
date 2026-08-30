"use client";

import { useId, useState, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import ayurajImg from "@/public/about/ayuraj.jpeg";
import ayubikeImg from "@/public/about/ayubike.jpeg";

function AboutPhoto({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <figure className="group relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-accent/25 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.65)] md:aspect-[4/5]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 92vw, 440px"
        placeholder="blur"
        className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </figure>
  );
}

function AboutBlock({
  photoSide,
  photo,
  alt,
  children,
}: {
  photoSide: "left" | "right";
  photo: StaticImageData;
  alt: string;
  children: ReactNode;
}) {
  // DOM order is always photo → text, so mobile stacks the photo above its
  // paragraphs in both blocks; md: order places it left or right on desktop.
  const photoOrder = photoSide === "left" ? "md:order-1" : "md:order-2";
  const textOrder = photoSide === "left" ? "md:order-2" : "md:order-1";
  return (
    <div className="grid gap-8 md:grid-cols-5 md:items-center md:gap-12">
      <Reveal delay={0.15} className={`${photoOrder} md:col-span-2`}>
        <AboutPhoto src={photo} alt={alt} />
      </Reveal>
      <Reveal delay={0} className={`${textOrder} md:col-span-3`}>
        <div className="max-w-[68ch] space-y-4 text-[17px] leading-[1.7] text-muted">
          {children}
        </div>
      </Reveal>
    </div>
  );
}

export default function About() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section
      id="about"
      aria-labelledby="about-h"
      className="scroll-mt-24 border-t border-border py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-[1100px]">
        {/* the section's own quiet geometry — static, very faint */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#FF3B30"
          className="pointer-events-none absolute right-[1%] top-[14%] -z-10 w-[34%] max-w-[380px] opacity-[0.05]"
        >
          <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" strokeWidth="1.4" />
        </svg>

        <Reveal>
          <SectionHeading index="01" title="About Me" id="about-h" />
        </Reveal>

        <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-24">
          <AboutBlock photoSide="right" photo={ayurajImg} alt="Ayush Narayan">
            <p>
              Hi, I&apos;m Ayush Narayan, a 7th-semester Information Science and
              Engineering student at B.M.S. College of Engineering, Bangalore,
              currently building my skills and experience with the goal of
              becoming a strong software engineer.
            </p>
            <p>
              I&apos;ve always been someone who likes to explore, experiment, and
              understand how things work. My interest in technology goes beyond
              simply learning programming languages or completing college
              assignments. I enjoy taking an idea, figuring out how it could
              actually work, and turning it into something useful. Whether it is
              solving a programming problem, working on a project, exploring a new
              technology, or experimenting with an idea, I prefer learning by
              actually building things.
            </p>
            <p>
              One thing that defines me is that I&apos;m curious and constantly
              experimenting. I don&apos;t like staying restricted to what is
              taught in a classroom. If something interests me, I tend to go down
              the rabbit hole — researching it, trying it myself, breaking things,
              fixing them, and learning from the process. I believe that some of
              the most valuable technical skills come from this process of
              figuring things out independently.
            </p>
          </AboutBlock>

          <AboutBlock
            photoSide="left"
            photo={ayubikeImg}
            alt="Ayush Narayan on a trip"
          >
            <p>
              Outside academics and coding, I enjoy exploring new places,
              travelling, taking photographs, and experiencing things outside my
              usual environment. I feel that travelling and exploring different
              places gives you a different perspective and keeps you curious.
              Photography is also something I enjoy because it makes me pay
              attention to details that I might otherwise overlook.
            </p>
            <p>
              My goal is simple: build useful things, keep learning, and become
              the kind of engineer who can take a problem from an idea to a
              working solution. I&apos;m always open to interesting problems,
              challenging projects, collaborations, and opportunities where I can
              learn, contribute, and grow.
            </p>
          </AboutBlock>

          <Reveal>
            <div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="inline-flex items-center gap-1.5 font-mono text-sm text-accent outline-offset-4 transition-colors duration-200 ease-smooth hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {open ? "Show less" : "More about my journey"}
                <span aria-hidden>{open ? "↑" : "↓"}</span>
              </button>

              <div
                id={panelId}
                className={`grid ${
                  reduce
                    ? ""
                    : "transition-[grid-template-rows] duration-[400ms] ease-out"
                }`}
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div
                    inert={!open || undefined}
                    className="max-w-[68ch] space-y-4 pt-6 text-[17px] leading-[1.7] text-muted"
                  >
                    <p>
                      My technical journey has given me a strong foundation in
                      C++, Python, data structures and algorithms, object-oriented
                      programming, databases, web technologies, and core computer
                      science concepts. I&apos;m particularly interested in
                      software development and enjoy working on projects where I
                      can combine problem-solving with practical implementation.
                    </p>
                    <p>
                      Over time, I&apos;ve also become increasingly interested in
                      AI, modern software development, and building real-world
                      applications. I like exploring new developer tools and
                      technologies and figuring out how they can make development
                      faster, smarter, and more effective. Rather than limiting
                      myself to one particular technology, I try to understand the
                      fundamentals well and then use the right tools for the
                      problem I&apos;m trying to solve.
                    </p>
                    <p>
                      As a student, I&apos;m currently focused on preparing myself
                      for the transition from college to the software industry.
                      I&apos;m working on strengthening my DSA and problem-solving
                      abilities, building better projects, improving my
                      understanding of computer science fundamentals, and gaining
                      practical experience through internships and real-world
                      development.
                    </p>
                    <p>
                      I don&apos;t consider myself someone who has everything
                      figured out yet — and that&apos;s okay. I&apos;m still
                      learning, experimenting, making mistakes, and improving.
                      What matters to me is continuing to move forward and
                      becoming better with every project and every experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-16 text-center text-lg font-medium text-accent sm:mt-20 sm:text-xl">
            Curious by nature. Builder at heart. Always learning.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
