import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX size={40} />
        </div>

        <p className="mt-6 font-heading text-7xl font-bold text-primary sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 font-heading text-2xl font-bold text-text sm:text-3xl">
          পৃষ্ঠা পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-text-muted sm:text-base">
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          URL ঠিক আছে কিনা যাচাই করুন অথবা হোম পেজে ফিরে যান।
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-bengali text-sm font-semibold text-text transition-colors hover:bg-background"
          >
            <ArrowLeft size={17} />
            আগের পৃষ্ঠায় যান
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
          >
            <Home size={17} />
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

