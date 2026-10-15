import { Suspense } from "react";
import { ExperiencesPage } from "@/features/experiences/experiences-page";
import { PageLoader } from "@/components/ui/page-loader";
export const metadata = { title: "Experiences | Reynald Quijano" };
export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading experiences" />}>
      <ExperiencesPage />
    </Suspense>
  );
}
