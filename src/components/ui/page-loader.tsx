import styles from "./page-loader.module.css";

export function PageLoader({ label = "Loading page" }: { label?: string }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.mark} aria-hidden="true">
        <span className={styles.symbol}>&lt;/&gt;</span>
        <span>ICYZAMA</span>
      </div>
      <div className={styles.blocks} aria-hidden="true">
        <span /><span /><span />
      </div>
      <p className={styles.label}>{label}<span aria-hidden="true">…</span></p>
    </div>
  );
}

/** A short, CSS-only entrance that also clears when JavaScript is unavailable. */
export function PortfolioPreloader() {
  return (
    <div className={styles.intro} aria-hidden="true">
      <PageLoader label="Welcome to my portfolio" />
    </div>
  );
}
