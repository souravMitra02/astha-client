import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  Phone,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const categoryLabels = {
  electrician: "ইলেকট্রিশিয়ান",
  plumber: "প্লাম্বার",
  "ac-service": "এসি সার্ভিস",
  cleaning: "ক্লিনিং সার্ভিস",
  carpenter: "কার্পেন্টার",
};

const categoryButtons = [
  { value: "all", label: "সব সেবাদাতা" },
  { value: "electrician", label: "ইলেকট্রিশিয়ান" },
  { value: "plumber", label: "প্লাম্বার" },
  { value: "ac-service", label: "এসি সার্ভিস" },
  { value: "cleaning", label: "ক্লিনিং সার্ভিস" },
  { value: "carpenter", label: "কার্পেন্টার" },
];

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const getProviders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/providers"
        );

        setProviders(response.data.providers || []);
      } catch (error) {
        console.error("Provider fetch error:", error);
        setError("সেবাদাতাদের তথ্য আনতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    getProviders();
  }, []);

  const filteredProviders = providers.filter((provider) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      provider.name?.toLowerCase().includes(search) ||
      provider.phone?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "all" ||
      provider.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            সেবাদাতা
          </h1>

          <p className="mt-3 font-bengali text-sm text-text-muted sm:text-base">
            আপনার প্রয়োজন অনুযায়ী নির্ভরযোগ্য সেবাদাতা খুঁজে নিন
          </p>
        </div>

        {/* Search & Filter */}
        {!loading && !error && providers.length > 0 && (
          <section className="mt-8 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="সেবাদাতা খুঁজুন..."
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 font-bengali text-sm text-text outline-none transition focus:border-primary"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categoryButtons.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 font-bengali text-sm font-semibold transition ${
                      selectedCategory === category.value
                        ? "bg-primary text-surface"
                        : "border border-border bg-surface text-text hover:border-primary hover:text-primary"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Result Header */}
        {!loading && !error && providers.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text">
                {selectedCategory === "all"
                  ? "সকল সেবাদাতা"
                  : categoryLabels[selectedCategory] || "সেবাদাতা"}
              </h2>

              <p className="mt-1 font-bengali text-sm text-text-muted">
                আপনার প্রয়োজন অনুযায়ী সেবাদাতা বেছে নিন
              </p>
            </div>

            <span className="hidden rounded-full bg-primary/10 px-3 py-1.5 font-bengali text-sm font-semibold text-primary sm:block">
              {filteredProviders.length} জন
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-background" />

                  <div className="flex-1">
                    <div className="h-5 w-32 rounded bg-background" />
                    <div className="mt-2 h-4 w-24 rounded bg-background" />
                  </div>
                </div>

                <div className="mt-6 h-4 w-36 rounded bg-background" />
                <div className="mt-5 h-10 w-full rounded-lg bg-background" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-10 text-center font-bengali text-danger">
            {error}
          </p>
        )}

        {/* No Providers */}
        {!loading && !error && providers.length === 0 && (
          <p className="mt-10 text-center font-bengali text-text-muted">
            বর্তমানে কোনো সেবাদাতা পাওয়া যায়নি।
          </p>
        )}

        {/* No Filter Results */}
        {!loading && !error && providers.length > 0 && filteredProviders.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background text-text-muted">
              <UserRound size={28} />
            </div>

            <h3 className="mt-5 font-heading text-xl font-bold text-text">
              কোনো সেবাদাতা পাওয়া যায়নি
            </h3>

            <p className="mt-2 font-bengali text-sm text-text-muted">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো সেবাদাতা পাওয়া যায়নি।
            </p>
          </div>
        )}

        {/* Provider Cards */}
        {!loading && !error && filteredProviders.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold text-text">
                      {provider.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 font-bengali text-sm text-text-muted">
                      <BriefcaseBusiness className="h-4 w-4 shrink-0" />

                      <span>
                        {categoryLabels[provider.category] || "সেবাদাতা"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                  <Phone className="h-4 w-4 text-primary" />

                  <span className="font-bengali text-sm text-text-muted">
                    {provider.phone}
                  </span>
                </div>

                <Link
                  to={`/providers/${provider._id}`}
                  className="mt-5 block w-full rounded-lg border border-primary px-4 py-2.5 text-center font-bengali text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface"
                >
                  প্রোফাইল দেখুন
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Providers;