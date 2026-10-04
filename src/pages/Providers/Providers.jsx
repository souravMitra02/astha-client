import { useEffect, useState } from "react";
import axios from "axios";
import { BriefcaseBusiness, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const categoryLabels = {
  electrician: "ইলেকট্রিশিয়ান",
  plumber: "প্লাম্বার",
  "ac-service": "এসি সার্ভিস",
  cleaning: "ক্লিনিং সার্ভিস",
  carpenter: "কার্পেন্টার",
};

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProviders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/providers"
        );

        setProviders(response.data.providers);
      } catch (error) {
        console.error("Provider fetch error:", error);
        setError("সেবাদাতাদের তথ্য আনতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    getProviders();
  }, []);

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-text">
            সেবাদাতা
          </h1>

          <p className="mt-3 font-bengali text-text-muted">
            আপনার প্রয়োজন অনুযায়ী নির্ভরযোগ্য সেবাদাতা খুঁজে নিন
          </p>
        </div>

        {loading && (
          <p className="mt-10 text-center font-bengali text-text-muted">
            সেবাদাতাদের তথ্য লোড হচ্ছে...
          </p>
        )}

        {error && (
          <p className="mt-10 text-center font-bengali text-danger">
            {error}
          </p>
        )}

        {!loading && !error && providers.length === 0 && (
          <p className="mt-10 text-center font-bengali text-text-muted">
            বর্তমানে কোনো সেবাদাতা পাওয়া যায়নি।
          </p>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
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
