"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/portfolio";

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        &lt;/&gt; ICYZAMA
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "CLOSE −" : "MENU +"}
      </button>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`main-nav ${open ? "is-open" : ""}`}
      >
        {navigation.map((item) => (
          <div className="nav-item" key={item.href}>
            <Link
              href={item.href}
              aria-current={path.startsWith(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
              {["/about", "/experiences"].includes(item.href) && (
                <span aria-hidden="true" className="chevron">
                  ▾
                </span>
              )}
            </Link>
            {item.href === "/about" && (
              <div className="nav-dropdown">
                <Link href="/about" onClick={() => setOpen(false)}>
                  About Me
                </Link>
                <Link href="/about#tech-stack" onClick={() => setOpen(false)}>
                  Technical Skills
                </Link>
              </div>
            )}
            {item.href === "/experiences" && (
              <div className="nav-dropdown">
                {["orgs", "hackathons", "internships"].map((tab, i) => (
                  <Link
                    key={tab}
                    href={`/experiences?tab=${tab}`}
                    onClick={() => setOpen(false)}
                  >
                    {["Student Organizations", "Hackathons & Competitions", "Internships"][i]}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <Link
        href="/contact"
        className="header-contact"
        onClick={() => setOpen(false)}
      >
        CONTACT ME <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}
