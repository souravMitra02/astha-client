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
        <div className="rounded-xl border border-border bg-surface p-6">
          <h1 className="font-heading text-3xl font-bold text-text">
            {provider.name}
          </h1>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-2 font-bengali text-text-muted">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />

              <span>
                {categoryLabels[provider.category] || "সেবাদাতা"}
              </span>
            </div>

            <div className="flex items-center gap-2 font-bengali text-text-muted">
              <Phone className="h-5 w-5 text-primary" />

              <span>{provider.phone}</span>
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
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <h3 className="font-heading text-xl font-bold text-text">
                    {service.title}
                  </h3>

                  <p className="mt-2 font-bengali text-sm text-text-muted">
                    {categoryLabels[service.category] || service.category}
                  </p>

                  <p className="mt-4 font-bengali text-sm leading-6 text-text-muted">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2 font-bengali text-sm text-text-muted">
                      <MapPin className="h-4 w-4 text-primary" />

                      <span>{service.location}</span>
                    </div>

                    <span className="font-bengali font-semibold text-text">
                      ৳{service.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                    }}
                    className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text">
                  সেবা চাই
                </h2>

                <p className="mt-1 font-bengali text-sm text-text-muted">
                  {selectedService.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedService(null);
                  setRequestMessage("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-background hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="requestMessage"
                className="font-bengali text-sm font-medium text-text"
              >
                আপনার প্রয়োজন সম্পর্কে লিখুন
              </label>

              <textarea
                id="requestMessage"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows="5"
                placeholder="আপনার সমস্যাটি সংক্ষেপে লিখুন..."
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 font-bengali text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <button
                          type="button"
                           onClick={handleRequestSubmit}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-bengali text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
            >
              অনুরোধ পাঠান
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProviderDetails;