import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BriefcaseBusiness, MapPin, Phone, X } from "lucide-react";
import Swal from "sweetalert2";

const categoryLabels = {
  electrician: "ইলেকট্রিশিয়ান",
  plumber: "প্লাম্বার",
  "ac-service": "এসি সার্ভিস",
  cleaning: "ক্লিনিং সার্ভিস",
  carpenter: "কার্পেন্টার",
};

const ProviderDetails = () => {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const getProviderDetails = async () => {
      try {
        const [providerResponse, servicesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/providers/${id}`),
          axios.get(`http://localhost:5000/api/services/provider/${id}`),
        ]);

        setProvider(providerResponse.data.provider);
        setServices(servicesResponse.data.services);
      } catch (error) {
        console.error("Provider details fetch error:", error);
        setError("সেবাদাতার তথ্য আনতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    getProviderDetails();
  }, [id]);

const handleRequestSubmit = async () => {
    if (!requestMessage.trim()) {
       Swal.fire({
      icon: "warning",
      title: "বার্তা দিন",
      text: "আপনার প্রয়োজন সম্পর্কে কিছু লিখুন।",
      confirmButtonText: "ঠিক আছে",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/api/requests",
      {
        serviceId: selectedService._id,
        message: requestMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      Swal.fire({
      icon: "success",
      title: "অনুরোধ পাঠানো হয়েছে",
      text: response.data.message,
      confirmButtonText: "ঠিক আছে",
    });

    setSelectedService(null);
setRequestMessage("");
  } catch (error) {
  console.error("Request submit error:", error);
  Swal.fire({
      icon: "error",
      title: "অনুরোধ পাঠানো যায়নি",
      text:
        error.response?.data?.message ||
        "সেবার অনুরোধ পাঠাতে সমস্যা হয়েছে।",
      confirmButtonText: "ঠিক আছে",
    });
}
};    
    
    
  if (loading) {
    return (
      <section className="bg-background py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center font-bengali text-text-muted">
            তথ্য লোড হচ্ছে...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center font-bengali text-danger">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Provider Information */}
        {/* Provider Information */}
<div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="font-bengali text-sm font-medium text-primary">
        সেবাদাতা
      </p>

      <h1 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
        {provider.name}
      </h1>
    </div>

    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-heading text-2xl font-bold text-primary">
      {provider.name?.charAt(0)}
    </div>
  </div>

  <div className="mt-7 grid gap-4 sm:grid-cols-2">
    <div className="rounded-xl bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-bengali text-xs text-text-muted">
            কাজের ধরন
          </p>

          <p className="mt-1 font-bengali font-semibold text-text">
            {categoryLabels[provider.category] || "সেবাদাতা"}
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-xl bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Phone className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-bengali text-xs text-text-muted">
            ফোন নম্বর
          </p>

          <p className="mt-1 font-bengali font-semibold text-text">
            {provider.phone}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Services */}
        <div className="mt-10">
          <h2 className="font-heading text-2xl font-bold text-text">
            এই সেবাদাতার সেবাসমূহ
          </h2>

          {services.length === 0 ? (
            <p className="mt-5 font-bengali text-text-muted">
              এই সেবাদাতা বর্তমানে কোনো সেবা যোগ করেননি।
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {services.map((service) => (
               <div
  key={service._id}
  className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
>
  <div className="flex items-start justify-between gap-4">
    <div>
      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
        {categoryLabels[service.category] || service.category}
      </span>

      <h3 className="mt-4 font-heading text-xl font-bold text-text">
        {service.title}
      </h3>
    </div>

    <div className="shrink-0 text-right">
      <p className="font-bengali text-xs text-text-muted">
        মূল্য
      </p>

      <p className="mt-1 font-heading text-xl font-bold text-primary">
        ৳{service.price}
      </p>
    </div>
  </div>

  <p className="mt-4 flex-1 font-bengali text-sm leading-7 text-text-muted">
    {service.description}
  </p>

  <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
    <MapPin className="h-4 w-4 shrink-0 text-primary" />

    <span className="font-bengali text-sm text-text-muted">
      {service.location}
    </span>
  </div>

  <button
    type="button"
    onClick={() => {
      setSelectedService(service);
    }}
    className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
  >
    সেবা চাই
  </button>
</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-xl">
      <div className="flex items-start justify-between gap-4 border-b border-border p-6 sm:p-7">
        <div>
          <p className="font-bengali text-sm font-medium text-primary">
            সেবা নেওয়ার অনুরোধ
          </p>

          <h2 className="mt-1 font-heading text-2xl font-bold text-text">
            সেবা চাই
          </h2>

          <p className="mt-2 font-bengali text-sm text-text-muted">
            {selectedService.title}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedService(null);
            setRequestMessage("");
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-background hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 sm:p-7">
        <div className="rounded-xl bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-bengali text-sm text-text-muted">
              সেবার মূল্য
            </span>

            <span className="font-heading font-bold text-primary">
              ৳{selectedService.price}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="requestMessage"
            className="font-bengali text-sm font-semibold text-text"
          >
            আপনার প্রয়োজন সম্পর্কে লিখুন
          </label>

          <textarea
            id="requestMessage"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            rows="5"
            placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 font-bengali text-sm leading-7 text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleRequestSubmit}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 font-bengali font-semibold text-surface transition-colors hover:bg-primary-hover"
        >
          অনুরোধ পাঠান
        </button>
      </div>
    </div>
  </div>
      )}
    </section>
  );
};

export default ProviderDetails;