import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Wrench,
  X,
  Loader2,
  Power,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  createService,
  getMyServices,
  updateService,
  deleteService,
} from "../../services/serviceService";

const initialFormData = {
  title: "",
  category: "",
  description: "",
  price: "",
  location: "",
  latitude: "",
  longitude: "",
  available: true,
};

const categories = [
  {
    value: "electrician",
    label: "ইলেকট্রিক্যাল",
  },
  {
    value: "plumber",
    label: "প্লাম্বিং",
  },
  {
    value: "ac-technician",
    label: "এসি সার্ভিস",
  },
  {
    value: "computer-technician",
    label: "কম্পিউটার",
  },
  {
    value: "car-mechanic",
    label: "গাড়ি সার্ভিস",
  },
  {
    value: "cleaner",
    label: "ক্লিনিং",
  },
  {
    value: "carpenter",
    label: "কাঠের কাজ",
  },
];

const ProviderServices = () => {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] =
    useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const loadServices = async () => {
    try {
      setLoading(true);

      const data = await getMyServices();

      setServices(data.services || []);
    } catch (error) {
      console.error("Load provider services error:", error);

      Swal.fire({
        title: "সমস্যা হয়েছে",
        text:
          error.response?.data?.message ||
          "আপনার সেবাগুলো লোড করা যায়নি।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);

    setFormData({
      title: service.title || "",
      category: service.category || "",
      description: service.description || "",
      price: service.price ?? "",
      location: service.location || "",
      latitude: service.latitude ?? "",
      longitude: service.longitude ?? "",
      available: service.available ?? true,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);
    setEditingService(null);
    setFormData(initialFormData);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const serviceData = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        location: formData.location.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        available: formData.available,
      };

      if (editingService) {
        await updateService(
          editingService._id,
          serviceData
        );

        await Swal.fire({
          title: "সেবা আপডেট হয়েছে",
          text: "আপনার সেবার তথ্য সফলভাবে আপডেট করা হয়েছে।",
          icon: "success",
          confirmButtonText: "ঠিক আছে",
        });
      } else {
        await createService(serviceData);

        await Swal.fire({
          title: "সেবা যোগ হয়েছে",
          text: "নতুন সেবা সফলভাবে যোগ করা হয়েছে।",
          icon: "success",
          confirmButtonText: "ঠিক আছে",
        });
      }

      closeModal();

      await loadServices();
    } catch (error) {
      console.error("Service submit error:", error);

      Swal.fire({
        title: "সমস্যা হয়েছে",
        text:
          error.response?.data?.message ||
          "সেবার তথ্য সংরক্ষণ করা যায়নি।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvailabilityToggle = async (service) => {
    const newAvailability = !service.available;

    try {
      setUpdatingAvailabilityId(service._id);

      const serviceData = {
        title: service.title,
        category: service.category,
        description: service.description,
        price: Number(service.price),
        location: service.location,
        latitude: Number(service.latitude),
        longitude: Number(service.longitude),
        available: newAvailability,
      };

      await updateService(service._id, serviceData);

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? {
                ...item,
                available: newAvailability,
              }
            : item
        )
      );

     toast.success(
  newAvailability
    ? "সেবা চালু করা হয়েছে"
    : "সেবা বন্ধ করা হয়েছে"
);
    } catch (error) {
      console.error(
        "Update service availability error:",
        error
      );

      toast.error(
  error.response?.data?.message ||
    "সেবার availability পরিবর্তন করা যায়নি।"
);
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

  const handleDelete = async (service) => {
    const result = await Swal.fire({
      title: "সেবা মুছে ফেলবেন?",
      text: `"${service.title}" সেবাটি মুছে ফেলা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(service._id);

      await deleteService(service._id);

      setServices((prev) =>
        prev.filter(
          (item) => item._id !== service._id
        )
      );

      await Swal.fire({
        title: "মুছে ফেলা হয়েছে",
        text: "সেবাটি সফলভাবে মুছে ফেলা হয়েছে।",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error) {
      console.error("Delete service error:", error);

      Swal.fire({
        title: "সমস্যা হয়েছে",
        text:
          error.response?.data?.message ||
          "সেবাটি মুছে ফেলা যায়নি।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-text sm:text-2xl">
              আমার সেবাসমূহ
            </h2>

            <p className="mt-1 font-bengali text-xs text-text-muted sm:text-sm">
              আপনার দেওয়া সেবাগুলো এখানে পরিচালনা করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bengali text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>নতুন সেবা যোগ করুন</span>
          </button>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-border p-4"
              >
                <div className="h-5 w-32 rounded bg-border/50" />
                <div className="mt-3 h-4 w-20 rounded bg-border/40" />
                <div className="mt-4 h-16 rounded-xl bg-border/30" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background px-4 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wrench size={24} />
            </div>

            <h3 className="mt-3 font-heading text-base font-bold text-text">
              এখনো কোনো সেবা যোগ করেননি
            </h3>

            <p className="mt-1 font-bengali text-xs text-text-muted sm:text-sm">
              আপনার প্রথম সেবা যোগ করতে উপরের button-এ click করুন।
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bengali text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Plus size={17} />
              নতুন সেবা যোগ করুন
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="rounded-2xl border border-border bg-background p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wrench size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-base font-bold text-text">
                        {service.title}
                      </h3>

                      <p className="mt-0.5 font-bengali text-xs text-text-muted">
                        {service.category}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 font-bengali text-sm leading-6 text-text-muted">
                  {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <p className="font-bengali text-xs text-text-muted">
                      মূল্য
                    </p>

                    <p className="font-heading text-base font-bold text-text">
                      ৳ {service.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAvailabilityToggle(service)
                      }
                      disabled={
                        updatingAvailabilityId ===
                        service._id
                      }
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 font-bengali text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        service.available
                          ? "border-success/20 bg-success/5 text-success hover:bg-success/10"
                          : "border-danger/20 bg-danger/5 text-danger hover:bg-danger/10"
                      }`}
                      title={
                        service.available
                          ? "সেবা বন্ধ করুন"
                          : "সেবা চালু করুন"
                      }
                    >
                      {updatingAvailabilityId ===
                      service._id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Power size={15} />
                      )}

                      {service.available
                        ? "সক্রিয়"
                        : "বন্ধ"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(service)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      title="সেবা সম্পাদনা"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId === service._id ||
                        updatingAvailabilityId ===
                          service._id
                      }
                      onClick={() =>
                        handleDelete(service)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-danger/20 bg-danger/5 text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                      title="সেবা মুছে ফেলুন"
                    >
                      {deletingId === service._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
              <div>
                <h2 className="font-heading text-lg font-bold text-text sm:text-xl">
                  {editingService
                    ? "সেবা সম্পাদনা করুন"
                    : "নতুন সেবা যোগ করুন"}
                </h2>

                <p className="mt-0.5 font-bengali text-xs text-text-muted">
                  সেবার তথ্যগুলো সঠিকভাবে পূরণ করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-muted transition-colors hover:bg-background hover:text-text disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-4 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    সেবার নাম
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: ফ্যান মেরামত"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-bengali text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    ক্যাটাগরি
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-bengali text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">
                      ক্যাটাগরি নির্বাচন করুন
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    মূল্য
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="500"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-bengali text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    বিবরণ
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="আপনার সেবাটি সম্পর্কে বিস্তারিত লিখুন..."
                    className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 font-bengali text-sm leading-6 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    লোকেশন
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="যেমন: বরিশাল সদর"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-bengali text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    placeholder="22.7010"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-bengali text-sm font-medium text-text">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    placeholder="90.3535"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                      className="h-4 w-4 accent-primary"
                    />

                    <div>
                      <p className="font-bengali text-sm font-semibold text-text">
                        সেবা বর্তমানে চালু আছে
                      </p>

                      <p className="mt-0.5 font-bengali text-xs text-text-muted">
                        বন্ধ করলে গ্রাহকরা এই সেবাটি
                        available হিসেবে দেখতে পাবে না।
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-border px-4 py-2.5 font-bengali text-sm font-semibold text-text transition-colors hover:bg-background disabled:opacity-50"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bengali text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {editingService
                    ? "আপডেট করুন"
                    : "সেবা যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderServices;