import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";
import { getAllServices } from "../../services/serviceService";


const categoryLabels = {
  electrician: "ইলেকট্রিশিয়ান",
  electrical: "ইলেকট্রিক্যাল",
  plumber: "প্লাম্বার",
  "ac-service": "AC সার্ভিস",
  cleaning: "ক্লিনিং",
  carpenter: "কার্পেন্টার",
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data.services || []);
      } catch (error) {
        console.error("Services load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-bengali text-sm font-semibold text-primary">
            <Wrench size={16} />
            প্রয়োজনীয় সেবা খুঁজুন
          </span>

          <h1 className="mt-5 font-heading text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            আপনার প্রয়োজনের সেবা
          </h1>

          <p className="mx-auto mt-4 max-w-2xl font-bengali text-sm leading-7 text-text-muted sm:text-base">
            আপনার প্রয়োজন অনুযায়ী নির্ভরযোগ্য সেবা খুঁজে নিন
            এবং সরাসরি সেবাদাতার কাছে অনুরোধ পাঠান।
          </p>
        </section>

        {/* Search & Filter */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="text"
                placeholder="সেবা খুঁজুন..."
                className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 font-bengali text-sm text-text outline-none transition focus:border-primary"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                className="shrink-0 rounded-xl bg-primary px-4 py-2.5 font-bengali text-sm font-semibold text-surface"
              >
                সব সেবা
              </button>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-sm font-medium text-text transition hover:border-primary hover:text-primary"
              >
                ইলেকট্রিশিয়ান
              </button>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-sm font-medium text-text transition hover:border-primary hover:text-primary"
              >
                প্লাম্বার
              </button>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-sm font-medium text-text transition hover:border-primary hover:text-primary"
              >
                AC সার্ভিস
              </button>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-sm font-medium text-text transition hover:border-primary hover:text-primary"
              >
                ক্লিনিং
              </button>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-sm font-medium text-text transition hover:border-primary hover:text-primary"
              >
                কার্পেন্টার
              </button>
            </div>
          </div>
        </section>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">
              সকল সেবা
            </h2>

            <p className="mt-1 font-bengali text-sm text-text-muted">
              আপনার কাছাকাছি প্রয়োজনীয় সেবা খুঁজে নিন
            </p>
          </div>

          <span className="hidden rounded-full bg-primary/10 px-3 py-1.5 font-bengali text-sm font-semibold text-primary sm:block">
            {services.length}টি সেবা
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-border bg-surface p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-background" />

                <div className="mt-5 h-5 w-40 rounded bg-background" />

                <div className="mt-3 h-4 w-24 rounded bg-background" />

                <div className="mt-5 h-4 w-full rounded bg-background" />

                <div className="mt-2 h-4 w-3/4 rounded bg-background" />

                <div className="mt-6 h-10 w-full rounded-xl bg-background" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && services.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background text-text-muted">
              <Wrench size={28} />
            </div>

            <h3 className="mt-5 font-heading text-xl font-bold text-text">
              কোনো সেবা পাওয়া যায়নি
            </h3>

            <p className="mt-2 font-bengali text-sm text-text-muted">
              বর্তমানে কোনো সেবা তালিকাভুক্ত নেই।
            </p>
          </div>
        )}

        {/* Service Cards */}
        {!loading && services.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
                    <Wrench size={22} />
                  </div>

                  <span className="rounded-full bg-background px-3 py-1.5 font-bengali text-xs font-semibold text-text-muted">
                    {categoryLabels[service.category] ||
                      service.category}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-heading text-xl font-bold text-text">
                    {service.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 font-bengali text-sm leading-6 text-text-muted">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                  <div>
                    <p className="font-bengali text-xs text-text-muted">
                      সেবার মূল্য
                    </p>

                    <p className="mt-1 font-heading text-xl font-bold text-primary">
                      ৳{service.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 font-bengali text-sm text-text-muted">
                    <MapPin size={16} />
                    <span>{service.location}</span>
                  </div>
                </div>

                <Link
                  to={`/services/${service._id}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-surface px-4 py-3 font-bengali text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-surface"
                >
                  বিস্তারিত দেখুন

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Services;