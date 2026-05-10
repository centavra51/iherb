import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>Страница не найдена / Pagina nu a fost gasita</h1>
        <p>
          Похоже, такой страницы сейчас нет. Вернитесь на русскую или румынскую версию витрины и
          откройте другие подборки.
        </p>
        <div className="not-found-actions">
          <Link href="/ru/" className="button button-primary">
            Русская версия
          </Link>
          <Link href="/ro/" className="button button-secondary">
            Versiunea romana
          </Link>
        </div>
      </div>
    </main>
  );
}
