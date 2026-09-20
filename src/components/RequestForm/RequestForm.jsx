import { useForm } from "react-hook-form";
import { createRequest } from "../../services/requestService";
import Swal from "sweetalert2";
const RequestForm = ({ service }) => {
  const {
    register,
      handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

    const onSubmit = async (data) => {
  try {
    const response = await createRequest(service._id, data.message);

    await Swal.fire({
      icon: "success",
      title: "অনুরোধ সফল হয়েছে",
      text: response.message,
      confirmButtonText: "ঠিক আছে",
    });
      reset();
  } catch (error) {
    console.error("Create request error:", error);
  }
};

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-text">
          সেবা নেওয়ার জন্য অনুরোধ করুন
        </h2>

        <p className="mt-2 font-bengali text-sm leading-6 text-text-muted">
          আপনার সমস্যার বিস্তারিত তথ্য দিন। সেবাদাতা আপনার অনুরোধটি দেখে
          যোগাযোগ করবেন।
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
      >
        <div>
          <label className="font-bengali text-sm font-semibold text-text">
            সেবার নাম
          </label>

          <input
            type="text"
            value={service?.title || ""}
            readOnly
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-bengali text-sm text-text-muted outline-none"
          />
        </div>

        <div>
          <label className="font-bengali text-sm font-semibold text-text">
            আপনার সমস্যার বিস্তারিত
          </label>

          <textarea
            rows="5"
            placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
            {...register("message", {
              required: "আপনার সমস্যার বিস্তারিত লিখুন",
            })}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 font-bengali text-sm text-text outline-none transition focus:border-primary"
          />

          {errors.message && (
            <p className="mt-2 font-bengali text-sm text-danger">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-5 py-3.5 font-bengali font-semibold text-surface transition hover:bg-primary-hover"
        >
          অনুরোধ পাঠান
        </button>
      </form>
    </div>
  );
};

export default RequestForm;