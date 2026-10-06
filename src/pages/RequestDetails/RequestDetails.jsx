import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Mail,
  Phone,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  cancelRequest,
  getSingleRequest,
} from "../../services/requestService";

const RequestDetails = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSingleRequest(id);
        setRequest(data.request);
      } catch (error) {
        console.error("Failed to fetch request:", error);

        setError(
          error.response?.data?.message ||
            "Request-এর তথ্য পাওয়া যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const getStatusConfig = (status) => {
    if (status === "accepted") {
      return {
        label: "গৃহীত",
        message: "সেবাদাতা আপনার অনুরোধটি গ্রহণ করেছেন।",
        badgeClass: "border-success/20 bg-success/10 text-success",
        iconClass: "bg-success text-white",
      };
    }

    if (status === "completed") {
      return {
        label: "সম্পন্ন",
        message: "সেবাদাতা আপনার অনুরোধটি সম্পন্ন করেছেন।",
        badgeClass: "border-success/20 bg-success/10 text-success",
        iconClass: "bg-success text-white",
      };
    }

    if (status === "rejected") {
      return {
        label: "প্রত্যাখ্যাত",
        message: "সেবাদাতা এই অনুরোধটি গ্রহণ করতে পারেননি।",
        badgeClass: "border-danger/20 bg-danger/10 text-danger",
        iconClass: "bg-danger text-white",
      };
    }

    if (status === "cancelled") {
      return {
        label: "বাতিল",
        message: "আপনি এই অনুরোধটি বাতিল করেছেন।",
        badgeClass: "border-danger/20 bg-danger/10 text-danger",
        iconClass: "bg-danger text-white",
      };
    }

    return {
      label: "অপেক্ষমাণ",
      message: "সেবাদাতা আপনার অনুরোধটি পর্যালোচনা করছেন।",
      badgeClass: "border-primary/20 bg-primary/10 text-primary",
      iconClass: "bg-primary text-white",
    };
  };

  const getStatusMessage = (status) => {
    if (status === "accepted") {
      return "এখন সেবাদাতার সাথে যোগাযোগ করে সেবার সময় ও অন্যান্য বিষয় নিশ্চিত করতে পারেন।";
    }

    if (status === "completed") {
      return "সেবাদাতা আপনার সেবার অনুরোধটি সফলভাবে সম্পন্ন করেছেন।";
    }

    if (status === "rejected") {
      return "এই অনুরোধটি গ্রহণ করা হয়নি। প্রয়োজনে অন্য কোনো সেবাদাতার কাছ থেকে সেবা নিতে পারেন।";
    }

    if (status === "cancelled") {
      return "এই অনুরোধটি আর প্রক্রিয়াধীন নেই। প্রয়োজনে নতুন করে কোনো সেবাদাতার কাছে অনুরোধ পাঠাতে পারেন।";
    }

    return "সেবাদাতা আপনার অনুরোধটি পর্যালোচনা করছেন। সিদ্ধান্ত নেওয়া হলে আপনি জানতে পারবেন।";
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopyRequestId = async () => {
    if (!request?._id) {
      return;
    }

    try {
      await navigator.clipboard.writeText(request._id);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy request ID error:", error);
    }
  };

  const handleCancelRequest = async () => {
    const result = await Swal.fire({
      title: "অনুরোধ বাতিল করবেন?",
      text: "এই অনুরোধটি বাতিল করার পর আর পুনরায় চালু করা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, বাতিল করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setCancelling(true);

      await cancelRequest(request._id);

      setRequest((prev) => ({
        ...prev,
        status: "cancelled",
        updatedAt: new Date(),
      }));

      await Swal.fire({
        icon: "success",
        title: "অনুরোধ বাতিল হয়েছে",
        text: "আপনার অনুরোধটি সফলভাবে বাতিল করা হয়েছে।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Cancel request error:", error);

      await Swal.fire({
        icon: "error",
        title: "সমস্যা হয়েছে",
        text:
          error.response?.data?.message ||
          "Request বাতিল করা যায়নি। আবার চেষ্টা করুন।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setCancelling(false);
    }
  };

  const statusConfig = getStatusConfig(request?.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 h-10 w-24 animate-pulse rounded-lg bg-border" />

          <div className="mb-6 space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-border" />
            <div className="h-4 w-80 animate-pulse rounded bg-border" />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="h-6 w-40 animate-pulse rounded bg-border" />
                <div className="h-4 w-72 animate-pulse rounded bg-border" />
              </div>

              <div className="h-7 w-20 animate-pulse rounded-full bg-border" />
            </div>

            <div className="mb-6 h-20 w-full animate-pulse rounded-xl bg-border" />

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-border" />
                <div className="h-5 w-48 animate-pulse rounded bg-border" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-border" />
                <div className="h-5 w-32 animate-pulse rounded bg-border" />
              </div>

              <div className="border-t border-border pt-5">
                <div className="mb-3 h-4 w-20 animate-pulse rounded bg-border" />

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="space-y-4">
                    <div className="h-10 w-48 animate-pulse rounded bg-border" />
                    <div className="h-10 w-64 animate-pulse rounded bg-border" />
                    <div className="h-10 w-48 animate-pulse rounded bg-border" />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <div className="mb-3 h-4 w-24 animate-pulse rounded bg-border" />
                <div className="h-20 w-full animate-pulse rounded-lg bg-border" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <XCircle size={24} />
          </div>

          <h1 className="mt-4 font-heading text-xl font-bold text-text">
            Request পাওয়া যায়নি
          </h1>

          <p className="mt-2 font-bengali text-sm leading-6 text-text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 font-bengali text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 font-bengali text-sm font-medium text-text-muted transition-all hover:border-primary/20 hover:text-primary active:scale-95"
        >
          <ArrowLeft size={17} />
          ফিরে যান
        </button>

        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
            অনুরোধের বিস্তারিত
          </h1>

          <p className="mt-1.5 font-bengali text-sm text-text-muted">
            আপনার সেবা অনুরোধের সম্পূর্ণ তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {/* Header */}
          <div className="border-b border-border p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench size={21} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-heading text-lg font-bold text-text sm:text-xl">
                    {request?.serviceTitle || "সেবা অনুরোধ"}
                  </h2>

                  {request?.serviceCategory && (
                    <p className="mt-1 font-bengali text-xs text-text-muted sm:text-sm">
                      {request.serviceCategory}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full border px-3 py-1 font-bengali text-xs font-semibold ${statusConfig.badgeClass}`}
              >
                {statusConfig.label}
              </span>
            </div>

            <div
              className={`mt-5 rounded-xl border p-4 ${statusConfig.badgeClass}`}
            >
              <p className="font-bengali text-sm font-semibold">
                {statusConfig.message}
              </p>

              <p className="mt-1.5 font-bengali text-xs leading-6 opacity-80">
                {getStatusMessage(request?.status)}
              </p>
            </div>
          </div>

          {/* Status Progress */}
          <div className="border-b border-border px-5 py-6 sm:px-6">
            <p className="mb-5 font-bengali text-sm font-semibold text-text">
              অনুরোধের অগ্রগতি
            </p>

            <div className="flex items-start">
              {/* Submitted */}
              <div className="flex flex-1 flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={17} />
                </div>

                <p className="mt-2 text-center font-bengali text-xs font-medium text-text">
                  পাঠানো হয়েছে
                </p>
              </div>

              {/* Submitted → Review */}
              <div
                className={`mt-4 h-0.5 flex-1 ${
                  request?.status === "pending"
                    ? "bg-border"
                    : "bg-primary"
                }`}
              />

              {/* Review / Accepted / Rejected / Cancelled */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    request?.status === "pending"
                      ? "bg-border text-text-muted"
                      : statusConfig.iconClass
                  }`}
                >
                  {request?.status === "accepted" ||
                  request?.status === "completed" ? (
                    <CheckCircle2 size={17} />
                  ) : request?.status === "rejected" ||
                    request?.status === "cancelled" ? (
                    <XCircle size={17} />
                  ) : (
                    <Clock3 size={17} />
                  )}
                </div>

                <p className="mt-2 text-center font-bengali text-xs font-medium text-text">
                  {request?.status === "pending"
                    ? "পর্যালোচনায়"
                    : request?.status === "accepted" ||
                      request?.status === "completed"
                      ? "গৃহীত"
                      : request?.status === "rejected"
                        ? "প্রত্যাখ্যাত"
                        : "বাতিল"}
                </p>
              </div>

              {/* Review → Completed */}
              <div
                className={`mt-4 h-0.5 flex-1 ${
                  request?.status === "completed"
                    ? "bg-success"
                    : "bg-border"
                }`}
              />

              {/* Completed */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    request?.status === "completed"
                      ? "bg-success text-white"
                      : "bg-border text-text-muted"
                  }`}
                >
                  <CheckCircle2 size={17} />
                </div>

                <p
                  className={`mt-2 text-center font-bengali text-xs font-medium ${
                    request?.status === "completed"
                      ? "text-success"
                      : "text-text-muted"
                  }`}
                >
                  সম্পন্ন
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="space-y-6">
              {/* Service Information */}
              <section>
                <p className="mb-3 font-bengali text-sm font-semibold text-text">
                  সেবার তথ্য
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="font-bengali text-xs text-text-muted">
                      সেবার নাম
                    </p>

                    <p className="mt-1.5 font-bengali text-sm font-semibold text-text">
                      {request?.serviceTitle || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="font-bengali text-xs text-text-muted">
                      সেবার ধরন
                    </p>

                    <p className="mt-1.5 font-bengali text-sm font-semibold text-text">
                      {request?.serviceCategory || "—"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Provider */}
              <section className="border-t border-border pt-6">
                <p className="mb-3 font-bengali text-sm font-semibold text-text">
                  সেবাদাতা
                </p>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <User size={18} className="text-primary" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bengali text-xs text-text-muted">
                          নাম
                        </p>

                        <p className="mt-0.5 font-bengali text-sm font-semibold text-text">
                          {request?.providerName || "অজানা সেবাদাতা"}
                        </p>
                      </div>
                    </div>

                    {request?.providerEmail && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Mail size={18} className="text-primary" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bengali text-xs text-text-muted">
                            ইমেইল
                          </p>

                          <a
                            href={`mailto:${request.providerEmail}`}
                            className="mt-0.5 block truncate text-sm font-medium text-primary hover:underline"
                          >
                            {request.providerEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {request?.providerPhone && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Phone size={18} className="text-primary" />
                        </div>

                        <div>
                          <p className="font-bengali text-xs text-text-muted">
                            ফোন
                          </p>

                          <a
                            href={`tel:${request.providerPhone}`}
                            className="mt-0.5 block text-sm font-medium text-primary hover:underline"
                          >
                            {request.providerPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Message */}
              <section className="border-t border-border pt-6">
                <p className="mb-3 font-bengali text-sm font-semibold text-text">
                  আপনার বার্তা
                </p>

                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-bengali text-sm leading-7 text-text">
                    {request?.message || "কোনো বার্তা দেওয়া হয়নি।"}
                  </p>
                </div>
              </section>

              {/* Request Information */}
              <section className="border-t border-border pt-6">
                <p className="mb-3 font-bengali text-sm font-semibold text-text">
                  অনুরোধের তথ্য
                </p>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                    <div className="min-w-0">
                      <p className="font-bengali text-xs text-text-muted">
                        Request ID
                      </p>

                      <p className="mt-1 break-all text-xs font-medium text-text sm:text-sm">
                        {request?._id}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyRequestId}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-2 font-bengali text-xs font-medium text-text-muted transition-colors hover:border-primary/20 hover:text-primary"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          কপি হয়েছে
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          কপি
                        </>
                      )}
                    </button>
                  </div>

                  {request?.createdAt && (
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                      <Calendar
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <div>
                        <p className="font-bengali text-xs text-text-muted">
                          অনুরোধের তারিখ
                        </p>

                        <p className="mt-1 font-bengali text-sm text-text">
                          {formatDateTime(request.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {request?.updatedAt && (
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                      <Clock3
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <div>
                        <p className="font-bengali text-xs text-text-muted">
                          সর্বশেষ আপডেট
                        </p>

                        <p className="mt-1 font-bengali text-sm text-text">
                          {formatDateTime(request.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Pending Action */}
              {request?.status === "pending" && (
                <section className="border-t border-border pt-6">
                  <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                    <p className="font-bengali text-sm font-semibold text-text">
                      অনুরোধ বাতিল করতে চান?
                    </p>

                    <p className="mt-1 font-bengali text-xs leading-6 text-text-muted">
                      সেবাদাতা এখনো আপনার অনুরোধটি গ্রহণ করেননি। প্রয়োজন না থাকলে
                      আপনি এটি বাতিল করতে পারেন।
                    </p>

                    <button
                      type="button"
                      onClick={handleCancelRequest}
                      disabled={cancelling}
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 font-bengali text-xs font-semibold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {cancelling ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          বাতিল করা হচ্ছে...
                        </>
                      ) : (
                        <>
                          <XCircle size={15} />
                          অনুরোধ বাতিল করুন
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}

              {/* Accepted Action */}
              {request?.status === "accepted" && (
                <section className="border-t border-border pt-6">
                  <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                    <p className="font-bengali text-sm font-semibold text-text">
                      এখন কী করবেন?
                    </p>

                    <p className="mt-1 font-bengali text-xs leading-6 text-text-muted">
                      সেবাদাতার সাথে যোগাযোগ করে সেবার সময় ও প্রয়োজনীয় বিষয়গুলো
                      নিশ্চিত করুন।
                    </p>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      {request?.providerPhone && (
                        <a
                          href={`tel:${request.providerPhone}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 font-bengali text-xs font-semibold text-white transition-colors hover:bg-success/90"
                        >
                          <Phone size={15} />
                          ফোন করুন
                        </a>
                      )}

                      {request?.providerEmail && (
                        <a
                          href={`mailto:${request.providerEmail}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 font-bengali text-xs font-semibold text-text transition-colors hover:border-primary/20 hover:text-primary"
                        >
                          <Mail size={15} />
                          ইমেইল করুন
                        </a>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Completed Action */}
              {request?.status === "completed" && (
                <section className="border-t border-border pt-6">
                  <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                        <CheckCircle2 size={18} />
                      </div>

                      <div>
                        <p className="font-bengali text-sm font-semibold text-text">
                          সেবা সম্পন্ন হয়েছে
                        </p>

                        <p className="mt-1 font-bengali text-xs leading-6 text-text-muted">
                          সেবাদাতা আপনার অনুরোধটি সফলভাবে সম্পন্ন করেছেন। এই
                          অনুরোধের আর কোনো status পরিবর্তনের প্রয়োজন নেই।
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Rejected Action */}
              {request?.status === "rejected" && (
                <section className="border-t border-border pt-6">
                  <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                    <p className="font-bengali text-sm font-semibold text-text">
                      অন্য সেবাদাতা খুঁজতে পারেন
                    </p>

                    <p className="mt-1 font-bengali text-xs leading-6 text-text-muted">
                      আপনার প্রয়োজন অনুযায়ী অন্য কোনো সেবাদাতার কাছ থেকে অনুরোধ
                      পাঠাতে পারেন।
                    </p>

                    <Link
                      to="/providers"
                      className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 font-bengali text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      সেবাদাতা দেখুন
                    </Link>
                  </div>
                </section>
              )}

              {/* Cancelled Action */}
              {request?.status === "cancelled" && (
                <section className="border-t border-border pt-6">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="font-bengali text-sm font-semibold text-text">
                      অনুরোধটি বাতিল করা হয়েছে
                    </p>

                    <p className="mt-1 font-bengali text-xs leading-6 text-text-muted">
                      প্রয়োজন হলে নতুন কোনো সেবাদাতার কাছে আবার অনুরোধ পাঠাতে
                      পারেন।
                    </p>

                    <Link
                      to="/providers"
                      className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 font-bengali text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      সেবাদাতা দেখুন
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestDetails;