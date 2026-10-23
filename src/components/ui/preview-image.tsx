"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import styles from "./preview-image.module.css";

type PreviewImageProps = Omit<ImageProps, "loading" | "preload" | "priority" | "onLoad" | "onError" | "placeholder">;

/** The containing figure reserves the dimensions; this layer never changes its layout. */
export function PreviewImage({ src, alt, ...props }: PreviewImageProps) {
  // An idle server render has no overlay, so images also work without hydration.
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const inspectImage = useCallback((image: HTMLImageElement | null) => {
    if (!image) return;
    setState(image.complete ? (image.naturalWidth > 0 ? "ready" : "error") : "loading");
  }, []);

  return (
    <span className={styles.layer} data-state={state} aria-busy={state === "loading"}>
      <Image
        {...props}
        key={typeof src === "string" ? src : "src" in src ? src.src : src.default.src}
        src={src}
        alt={alt}
        loading="lazy"
        ref={inspectImage}
        aria-hidden={state === "error" ? true : props["aria-hidden"]}
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
      />
      <span className={styles.skeleton} aria-hidden="true" />
      {state === "error" && (
        <span className={styles.fallback} role="img" aria-label={`${alt || "Preview"}. Image unavailable.`}>
          Image unavailable
        </span>
      )}
    </span>
  );
}
