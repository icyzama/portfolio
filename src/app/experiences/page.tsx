import { ExperiencesPage } from "@/features/experiences/experiences-page";
export const metadata = { title: "Experiences | Reynald Quijano" };
export default async function Page({ searchParams }: PageProps<"/experiences">) {
  const query = await searchParams;
  return <ExperiencesPage tab={typeof query.tab === "string" ? query.tab : undefined} />;
}
