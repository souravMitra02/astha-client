import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const LoginModal = ({ onClose, onOpenRegister }) => {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keydown and Scroll Lock
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
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
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
        className="relative w-full max-w-md transform overflow-hidden rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-2xl backdrop-blur-xl transition-all sm:p-8 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow Accent */}
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="মোডাল বন্ধ করুন"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-all hover:bg-background hover:text-text active:scale-90"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="pr-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            আস্থা
          </div>

          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl">
            স্বাগতম ফিরে এসেছেন!
          </h2>

          <p className="mt-1 font-bengali text-xs text-text-muted sm:text-sm">
            আপনার অ্যাকাউন্টে লগইন করে সেবাসমূহ উপভোগ করুন।
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="mb-1.5 block font-bengali text-xs font-semibold text-text">
              ইমেইল অ্যাড্রেস
            </label>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full rounded-2xl border border-border bg-background/80 pl-11 pr-4 py-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              />
              <svg
                className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/60 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block font-bengali text-xs font-semibold text-text">
                পাসওয়ার্ড
              </label>
              <button
                type="button"
                className="font-bengali text-xs text-primary transition hover:underline"
              >
               পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-border bg-background/80 pl-11 pr-11 py-3 text-sm text-text outline-none transition-all placeholder:text-text-muted/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
              />

              {/* Left Lock Icon */}
              <svg
                className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/60 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>

              {/* Password Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text active:scale-90"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.98 8.98 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs text-danger">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bengali font-medium leading-tight">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-2xl bg-primary py-3.5 font-bengali font-semibold text-surface shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
                <span>লগইন হচ্ছে...</span>
              </div>
            ) : (
              "লগইন করুন"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center font-bengali text-xs text-text-muted">
          নতুন ব্যবহারকারী?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenRegister) onOpenRegister();
            }}
            className="font-semibold text-primary transition hover:underline"
          >
            অ্যাকাউন্ট তৈরি করুন
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;