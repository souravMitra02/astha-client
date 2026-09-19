import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleService } from "../services/serviceService";
import RequestForm from "../components/RequestForm/RequestForm";

const categoryLabels = {
  electrician: "ইলেকট্রিশিয়ান",
  electrical: "ইলেকট্রিক্যাল",
  plumber: "প্লাম্বার",
  "ac-service": "AC সার্ভিস",
  cleaning: "ক্লিনিং",
  carpenter: "কার্পেন্টার",
};

const ServiceDetails = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await getSingleService(id);

        setService(data.service);
      } catch (error) {
        console.error("Service details load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-bengali text-text-muted">
            লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-bengali text-text-muted">
            সার্ভিস পাওয়া যায়নি।
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1.5 font-bengali text-sm font-semibold text-primary">
                {categoryLabels[service.category] || service.category}
              </span>

              <h1 className="mt-4 font-heading text-3xl font-bold text-text sm:text-4xl">
                {service.title}
              </h1>
            </div>

            <div className="text-right">
              <p className="font-bengali text-sm text-text-muted">
                সেবার মূল্য
              </p>

              <p className="mt-1 font-heading text-2xl font-bold text-primary">
                ৳{service.price}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h2 className="font-heading text-xl font-bold text-text">
              সেবার বিস্তারিত
            </h2>

            <p className="mt-3 font-bengali leading-8 text-text-muted">
              {service.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-background p-4">
              <p className="font-bengali text-sm text-text-muted">
                অবস্থান
              </p>

              <p className="mt-1 font-bengali font-semibold text-text">
                {service.location}
              </p>
            </div>

            <div className="rounded-xl bg-background p-4">
              <p className="font-bengali text-sm text-text-muted">
                সেবার অবস্থা
              </p>

              <p
                className={`mt-1 font-bengali font-semibold ${
                  service.available
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {service.available
                  ? "সেবা পাওয়া যাচ্ছে"
                  : "সেবা বর্তমানে বন্ধ"}
              </p>
            </div>
          </div>

          <button
                      type="button"
                      onClick={() => setShowRequestForm(true)}
            className="mt-8 w-full rounded-xl bg-primary px-5 py-3.5 font-bengali font-semibold text-surface transition hover:bg-primary-hover"
          >
            সেবা নিন
                  </button>
        </div>

       {showRequestForm && <RequestForm service={service} />}
      </div>
    </main>
  );
};

export default ServiceDetails;