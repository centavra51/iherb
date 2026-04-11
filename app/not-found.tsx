import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>Страница не найдена</h1>
        <p>Похоже, такого URL еще нет в опубликованном SEO-кластере.</p>
        <Link href="/" className="button button-primary">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
