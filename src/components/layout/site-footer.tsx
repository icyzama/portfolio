import Link from "next/link";
import { Asset } from "@/components/ui/design";
import { profile } from "@/content/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-brand">
        &lt;/&gt; ICYZAMA
      </Link>
      <p>© 2026 · All rights reserved.</p>
      <div className="social-links">
        <a href={profile.github} aria-label="GitHub">
          <Asset src="/figma/home-icon.svg" width={17} />
        </a>
        <a href={profile.linkedin} aria-label="LinkedIn">
          <Asset src="/figma/home-icon1.svg" width={17} />
        </a>
      </div>
    </footer>
  );
}
