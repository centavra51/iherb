import { permanentRedirect } from "next/navigation";

type Params = { slug: string };

export default async function LegacySeoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  permanentRedirect(`/ru/${slug}/`);
}
