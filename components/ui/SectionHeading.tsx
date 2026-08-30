import type { ReactNode } from "react";

type Props = {
  index: string;
  title: string;
  id: string;
  children?: ReactNode;
};

export default function SectionHeading({ index, title, id, children }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent" aria-hidden>
          {index}
        </span>
        <h2
          id={id}
          className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <p className="max-w-xl text-sm leading-relaxed text-muted">{children}</p>
      ) : null}
    </div>
  );
}
