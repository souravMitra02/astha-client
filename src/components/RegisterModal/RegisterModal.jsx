import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  X,
  AlertCircle,
} from "lucide-react";

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
      if (e.key === "Escape") {
        onClose();
      }
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="মোডাল বন্ধ করুন"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-background hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            আস্থা
          </div>

          <h2 className="mt-3 font-heading text-2xl font-bold text-text sm:text-3xl">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h2>

          <p className="mt-2 font-bengali text-sm leading-6 text-text-muted">
            আস্থার সাথে যুক্ত হয়ে প্রয়োজনীয় সেবা খুঁজুন বা আপনার সেবা প্রদান করুন।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block font-bengali text-sm font-semibold text-text"
            >
              আপনার নাম
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="আপনার পূর্ণ নাম"
                required
                className={`w-full rounded-xl border bg-background py-3 pl-11 pr-4 font-bengali text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:ring-4 ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block font-bengali text-sm font-semibold text-text"
            >
              ইমেইল অ্যাড্রেস
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className={`w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:ring-4 ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block font-bengali text-sm font-semibold text-text"
            >
              ফোন নম্বর
            </label>

            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                required
                className={`w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:ring-4 ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-bengali text-sm font-semibold text-text"
            >
              পাসওয়ার্ড
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full rounded-xl border bg-background py-3 pl-4 pr-11 text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:ring-4 ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border focus:border-primary focus:ring-primary/10"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block font-bengali text-sm font-semibold text-text">
              আপনি কীভাবে আস্থা ব্যবহার করতে চান?
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`rounded-xl border px-4 py-3 font-bengali text-sm font-semibold transition-colors ${
                  formData.role === "user"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-text-muted hover:border-primary/50 hover:text-text"
                }`}
              >
                সেবা নিতে চাই
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("provider")}
                className={`rounded-xl border px-4 py-3 font-bengali text-sm font-semibold transition-colors ${
                  formData.role === "provider"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-text-muted hover:border-primary/50 hover:text-text"
                }`}
              >
                সেবা দিতে চাই
              </button>
            </div>
          </div>

          {/* Provider Category */}
          {formData.role === "provider" && (
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block font-bengali text-sm font-semibold text-text"
              >
                আপনার সেবার ধরন
              </label>

              <div className="relative">
                <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-11 pr-4 font-bengali text-sm text-text outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">সেবার ধরন নির্বাচন করুন</option>
                  <option value="electrician">ইলেকট্রিক্যাল</option>
                  <option value="plumber">প্লাম্বার</option>
                  <option value="ac-service">AC সার্ভিস</option>
                  <option value="cleaning">ক্লিনিং</option>
                  <option value="carpenter">কার্পেন্টার</option>
                </select>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />

              <p className="font-bengali text-sm leading-6 text-danger">
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 font-bengali font-semibold text-surface shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                অ্যাকাউন্ট তৈরি হচ্ছে...
              </span>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center font-bengali text-sm text-text-muted">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();

              if (onOpenLogin) {
                onOpenLogin();
              }
            }}
            className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            লগইন করুন
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;

