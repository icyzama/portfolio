import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionLabel } from "./page-label";

export function Asset({
  src,
  width,
  height = width,
  alt = "",
  className = "",
}: {
  src: string;
  width: number;
  height?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={src.endsWith(".svg") ? "eager" : undefined}
      unoptimized={src.endsWith(".svg")}
    />
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags" aria-label="Skills and tools">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ActionLink({
  href,
  children,
  tone = "plain",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "plain" | "yellow" | "blue" | "white";
  className?: string;
}) {
  return (
    <Link className={`action action-${tone} ${className}`} href={href}>
      {children}
    </Link>
  );
}

export function PageHero({
  label,
  title,
  accent = "orange",
  count,
  className = "",
  square = false,
}: {
  label: string;
  title: ReactNode;
  accent?: string;
  count?: string;
  className?: string;
  square?: boolean;
}) {
  return (
    <section className={`page-hero ${className}`}>
      <div className="page-hero-copy">
        <SectionLabel>{label}</SectionLabel>
        <h1>{title}</h1>
      </div>
      <div className={`page-hero-accent tone-${accent}`} aria-hidden={!count}>
        {count && <span>{count}</span>}
        {square && <div className="accent-square" aria-hidden="true" />}
      </div>
    </section>
  );
}
