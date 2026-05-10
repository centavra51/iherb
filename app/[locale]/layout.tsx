import { notFound } from "next/navigation";
import { isLocale } from "../../lib/i18n";

type Params = { locale: string };

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Params>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return children;
}
