import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleService } from "../services/serviceService";

const ServiceDetails = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <p>লোড হচ্ছে...</p>;
  }

  if (!service) {
    return <p>সার্ভিস পাওয়া যায়নি।</p>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-text">
          {service.title}
        </h1>

        <p className="mt-2 font-bengali text-text-muted">
          {service.category}
        </p>

        <p className="mt-6 font-bengali text-text-muted">
          {service.description}
        </p>

        <p className="mt-6 font-heading text-2xl font-bold text-primary">
          ৳{service.price}
        </p>

        <p className="mt-3 font-bengali text-text-muted">
          📍 {service.location}
        </p>
      </div>
    </main>
  );
};

export default ServiceDetails;