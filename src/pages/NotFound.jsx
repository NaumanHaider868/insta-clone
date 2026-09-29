import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0b] px-4 py-8 text-[#f5f5f5]">
      <section className="w-full max-w-md rounded-2xl border border-[#363636] bg-[#1c1c1c] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#8ea7ff]">404</p>
        <h1 className="mb-3 text-2xl font-semibold text-white">Sorry, this page isn&apos;t available.</h1>
        <p className="mb-6 text-sm text-[#a8a8a8]">
          The link you followed may be broken, or the page has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#4c77e2] px-6 text-sm font-semibold text-white transition hover:bg-[#3f68d2]"
        >
          Go to home
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
