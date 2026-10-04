import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  ClipboardList,
  Inbox,
  UserRound,
  Wrench,
  XCircle,
  Loader2,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import {
  getMyRequests,
  getProviderRequests,
  updateRequestStatus,
} from "../../services/requestService";

const Dashboard = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);

        const data =
          user?.role === "provider"
            ? await getProviderRequests()
            : await getMyRequests();

        setRequests(data.requests || []);
      } catch (error) {
        console.error("Requests load error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadRequests();
    }
  }, [user]);

  const handleStatusUpdate = async (requestId, status) => {
    const isAccepting = status === "accepted";

    const result = await Swal.fire({
      title: isAccepting
        ? "অনুরোধটি গ্রহণ করবেন?"
        : "অনুরোধটি প্রত্যাখ্যান করবেন?",
      text: isAccepting
        ? "এই সেবার অনুরোধটি গ্রহণ করলে গ্রাহককে জানানো হবে।"
        : "এই সেবার অনুরোধটি প্রত্যাখ্যান করলে গ্রাহককে জানানো হবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isAccepting
        ? "হ্যাঁ, গ্রহণ করুন"
        : "হ্যাঁ, প্রত্যাখ্যান করুন",
      cancelButtonText: "বাতিল",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdatingId(requestId);

      await updateRequestStatus(requestId, status);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status }
            : request
        )
      );

      await Swal.fire({
        title: isAccepting
          ? "অনুরোধ গৃহীত"
          : "অনুরোধ প্রত্যাখ্যাত",
        text: isAccepting
          ? "সেবার অনুরোধটি সফলভাবে গ্রহণ করা হয়েছে।"
          : "সেবার অনুরোধটি সফলভাবে প্রত্যাখ্যান করা হয়েছে।",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error) {
      console.error("Status update error:", error);

      await Swal.fire({
        title: "সমস্যা হয়েছে",
        text: "অনুরোধের status পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const acceptedRequests = requests.filter(
    (r) => r.status === "accepted"
  ).length;

  const rejectedRequests = requests.filter(
    (r) => r.status === "rejected"
  ).length;

  const summaryCards = [
    {
      title: "মোট অনুরোধ",
      value: totalRequests,
      icon: ClipboardList,
      bgClass: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "অপেক্ষমাণ",
      value: pendingRequests,
      icon: Clock3,
      bgClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      title: "গৃহীত",
      value: acceptedRequests,
      icon: CheckCircle2,
      bgClass:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      title: "প্রত্যাখ্যাত",
      value: rejectedRequests,
      icon: XCircle,
      bgClass:
        "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-bengali text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            গৃহীত
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 font-bengali text-xs font-semibold text-rose-600">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            প্রত্যাখ্যাত
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-bengali text-xs font-semibold text-amber-600">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-500" />
            অপেক্ষমাণ
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-4 dark:bg-background sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Navigation & Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 font-bengali text-xs font-medium text-text transition-all hover:bg-background hover:shadow-xs active:scale-95 sm:text-sm"
          >
            <ArrowLeft size={16} />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>

        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
              ড্যাশবোর্ড ওভারভিউ
            </span>

            <h1 className="mt-2 font-heading text-xl font-bold tracking-tight text-text sm:mt-3 sm:text-3xl lg:text-4xl">
              স্বাগতম,{" "}
              <span className="text-primary">{user?.name}</span>!
            </h1>

            <p className="mt-2 font-bengali text-xs leading-relaxed text-text-muted sm:text-base">
              {user?.role === "provider"
                ? "আপনার কাছে আসা সেবার অনুরোধগুলো এখানে সহজে পরিচালনা ও ট্র্যাক করুন।"
                : "আপনার পাঠানো সকল সেবার অনুরোধ এবং বর্তমান অবস্থা এখান থেকে মনিটর করুন।"}
            </p>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl sm:h-40 sm:w-40" />
        </section>

        {/* Responsive Summary Stats Grid */}
        <section className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bengali text-xs font-medium text-text-muted">
                      {card.title}
                    </p>

                    <p className="mt-1 font-heading text-xl font-bold text-text sm:text-3xl">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-xl ${card.bgClass}`}
                  >
                    <Icon
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      strokeWidth={2.2}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Requests List Section */}
        <section className="mt-8 sm:mt-10">
          <div className="flex flex-row items-center justify-between gap-2 border-b border-border/60 pb-3 sm:pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-text sm:text-2xl">
                {user?.role === "provider"
                  ? "আসা অনুরোধসমূহ"
                  : "আমার অনুরোধসমূহ"}
              </h2>

              <p className="mt-0.5 hidden font-bengali text-xs text-text-muted sm:block sm:text-sm">
                {user?.role === "provider"
                  ? "গ্রাহকদের সার্ভিস রিকুয়েস্ট গ্রহণ বা প্রত্যাখ্যান করুন।"
                  : "আপনার পাঠানো সার্ভিস রিকুয়েস্টগুলোর বর্তমান স্ট্যাটাস দেখুন।"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 font-bengali text-xs font-medium text-text-muted shadow-xs">
              মোট:{" "}
              <strong className="text-primary">
                {totalRequests}
              </strong>{" "}
              টি
            </span>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-4 shadow-xs sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-36 rounded-lg bg-border/50 sm:w-48" />

                    <div className="h-5 w-16 rounded-full bg-border/50 sm:w-20" />
                  </div>

                  <div className="mt-4 h-4 w-28 rounded bg-border/40" />

                  <div className="mt-4 h-12 w-full rounded-xl bg-border/30 sm:h-16" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            /* Empty State */
            <div className="mt-6 rounded-2xl border border-dashed border-border/80 bg-surface px-4 py-12 text-center sm:mt-8 sm:py-16">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary sm:h-16 sm:w-16">
                <Inbox className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>

              <h3 className="mt-3 font-heading text-base font-bold text-text sm:mt-4 sm:text-lg">
                কোনো অনুরোধ পাওয়া যায়নি
              </h3>

              <p className="mx-auto mt-1 max-w-sm font-bengali text-xs text-text-muted sm:text-sm">
                {user?.role === "provider"
                  ? "বর্তমানে আপনার কাছে কোনো সেবার অনুরোধ অপেক্ষমাণ নেই।"
                  : "আপনি এখনো কোনো সেবার জন্য অনুরোধ পাঠাননি।"}
              </p>
            </div>
          ) : (
            /* Request List */
            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="group rounded-xl border border-border bg-surface p-4 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-md sm:rounded-2xl sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 sm:gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
                          <Wrench size={18} className="sm:hidden" />
                          <Wrench size={20} className="hidden sm:block" />
                        </div>

                        <div>
                          <h3 className="font-heading text-base font-bold leading-snug text-text sm:text-lg">
                            {request.serviceTitle || "সেবা অনুরোধ"}
                          </h3>

                          {request.serviceCategory && (
                            <span className="inline-block font-bengali text-xs text-text-muted">
                              শ্রেণী: {request.serviceCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-2.5 font-bengali text-xs text-text-muted sm:gap-4 sm:pt-3">
                      <div className="flex items-center gap-1.5">
                        <UserRound size={14} className="text-primary" />

                        <span>
                          {user?.role === "provider"
                            ? "গ্রাহক: "
                            : "সেবাদাতা: "}

                          <strong className="font-semibold text-text">
                            {user?.role === "provider"
                              ? request.userName || "অজানা গ্রাহক"
                              : request.providerName || "অজানা সেবাদাতা"}
                          </strong>
                        </span>
                      </div>

                      {request.createdAt && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />

                          <span>
                            {new Date(
                              request.createdAt
                            ).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Box */}
                    <div className="rounded-xl border border-border/40 bg-background/60 p-3 sm:p-3.5">
                      <p className="font-bengali text-xs leading-relaxed text-text-muted sm:text-sm">
                        {request.message ||
                          "কোনো অতিরিক্ত বার্তা নেই।"}
                      </p>
                    </div>

                    {/* Request Details Button */}
                    <div className="pt-1 sm:pt-2">
                      <Link
                        to={`/requests/${request._id}`}
                        className="flex w-full items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 font-bengali text-xs font-semibold text-text transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:py-2.5 sm:text-sm"
                      >
                        বিস্তারিত দেখুন
                      </Link>
                    </div>

                    {/* Provider Actions */}
                    {user?.role === "provider" &&
                      request.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                          <button
                            type="button"
                            disabled={updatingId === request._id}
                            onClick={() =>
                              handleStatusUpdate(
                                request._id,
                                "accepted"
                              )
                            }
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 font-bengali text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:py-2.5 sm:text-sm"
                          >
                            {updatingId === request._id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}

                            <span>গ্রহণ করুন</span>
                          </button>

                          <button
                            type="button"
                            disabled={updatingId === request._id}
                            onClick={() =>
                              handleStatusUpdate(
                                request._id,
                                "rejected"
                              )
                            }
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 font-bengali text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:py-2.5 sm:text-sm"
                          >
                            {updatingId === request._id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={15} />
                            )}

                            <span>প্রত্যাখ্যান</span>
                          </button>
                        </div>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;