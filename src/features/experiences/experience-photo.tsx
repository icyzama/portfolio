import Image from "next/image";
import styles from "./experiences.module.css";

export function ExperiencePhoto({ src, alt, fit = "cover", sizes = "(max-width: 1000px) 90vw, 46vw" }: { src?: string; alt: string; fit?: "cover" | "contain"; sizes?: string }) {
  return (
    <figure className={`${styles.photo} ${fit === "contain" ? styles.photoContain : ""}`} aria-label={src ? undefined : `Photo placeholder: ${alt}`}>
      {src ? (
        <>
          {fit === "contain" && (
            <Image
              src={src}
              alt=""
              width={1280}
              height={720}
              sizes={sizes}
              loading="lazy"
              className={styles.photoBackdrop}
              aria-hidden="true"
            />
          )}
          <Image src={src} alt={alt} width={1280} height={720} sizes={sizes} loading="lazy" className={styles.photoImage} />
        </>
      ) : (
        <div className={styles.photoPlaceholder}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 6h4l2-3h4l2 3h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>PHOTO COMING SOON</span>
        </div>
      )}
    </figure>
  );
}
