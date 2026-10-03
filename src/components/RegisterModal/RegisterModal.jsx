import { useEffect, useState } from "react";
import axios from "axios";

const RegisterModal = ({ onClose, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    category: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      category: role === "provider" ? prev.category : "",
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );

      if (response.status === 201) {
        onClose();

        if (onOpenLogin) {
          onOpenLogin();
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-xl transition-all sm:p-8 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          aria-label="মোডাল বন্ধ করুন"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-all hover:bg-background hover:text-text active:scale-90"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="pr-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            আস্থা
          </div>

          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h2>

          <p className="mt-1 font-bengali text-xs text-text-muted sm:text-sm">
            আস্থার সাথে যুক্ত হয়ে প্রয়োজনীয় সেবা খুঁজুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
              আপনার নাম
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার পূর্ণ নাম"
              required
              className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
              ইমেইল অ্যাড্রেস
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
              ফোন নম্বর
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
              className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
              পাসওয়ার্ড
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 pr-11 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text active:scale-90"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.98 8.98 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bengali text-xs font-semibold text-text">
              আপনি কীভাবে আস্থা ব্যবহার করতে চান?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`rounded-2xl border px-4 py-3 font-bengali text-sm font-semibold transition ${
                  formData.role === "user"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-text-muted hover:border-primary/50"
                }`}
              >
                সেবা নিতে চাই
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("provider")}
                className={`rounded-2xl border px-4 py-3 font-bengali text-sm font-semibold transition ${
                  formData.role === "provider"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-text-muted hover:border-primary/50"
                }`}
              >
                সেবা দিতে চাই
              </button>
            </div>
          </div>

          {formData.role === "provider" && (
            <div>
              <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
                আপনার সেবার ধরন
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-text outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              >
                <option value="">সেবার ধরন নির্বাচন করুন</option>
                <option value="electrician">ইলেকট্রিক্যাল</option>
                <option value="plumber">প্লাম্বার</option>
                <option value="ac-service">AC সার্ভিস</option>
                <option value="cleaning">ক্লিনিং</option>
                <option value="carpenter">কার্পেন্টার</option>
              </select>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs text-danger">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span className="font-bengali font-medium leading-tight">
                {error}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-2xl bg-primary py-3.5 font-bengali font-semibold text-surface shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
              </div>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-bengali text-xs text-text-muted">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();

              if (onOpenLogin) {
                onOpenLogin();
              }
            }}
            className="font-semibold text-primary transition hover:underline"
          >
            লগইন করুন
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;