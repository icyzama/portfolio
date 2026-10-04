import { Suspense } from "react";
import { ExperiencesPage } from "@/features/experiences/experiences-page";
export const metadata = { title: "Experiences | Reynald Quijano" };
export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Loading experiences…</p>}>
      <ExperiencesPage />
    </Suspense>
  );
}
