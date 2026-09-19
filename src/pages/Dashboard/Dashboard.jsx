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
    try {
      setUpdatingId(requestId);
      await updateRequestStatus(requestId, status);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const acceptedRequests = requests.filter((r) => r.status === "accepted").length;
  const rejectedRequests = requests.filter((r) => r.status === "rejected").length;

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
      bgClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      title: "প্রত্যাখ্যাত",
      value: rejectedRequests,
      icon: XCircle,
      bgClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-bengali text-xs font-semibold text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            গৃহীত
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 font-bengali text-xs font-semibold text-rose-600 border border-rose-500/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            প্রত্যাখ্যাত
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 font-bengali text-xs font-semibold text-amber-600 border border-amber-500/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            অপেক্ষমাণ
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-4 sm:py-8 dark:bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Navigation & Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 font-bengali text-xs sm:text-sm font-medium text-text transition-all hover:bg-background hover:shadow-xs active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>

        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-surface p-4 sm:p-8 shadow-sm transition-all hover:shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-bengali text-xs font-semibold text-primary">
              ড্যাশবোর্ড ওভারভিউ
            </span>
            <h1 className="mt-2 sm:mt-3 font-heading text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text">
              স্বাগতম, <span className="text-primary">{user?.name}</span>!
            </h1>
            <p className="mt-2 font-bengali text-xs sm:text-base leading-relaxed text-text-muted">
              {user?.role === "provider"
                ? "আপনার কাছে আসা সেবার অনুরোধগুলো এখানে সহজে পরিচালনা ও ট্র্যাক করুন।"
                : "আপনার পাঠানো সকল সেবার অনুরোধ এবং বর্তমান অবস্থা এখান থেকে মনিটর করুন।"}
            </p>
          </div>
          {/* Subtle Background Glow */}
          <div className="absolute -right-12 -top-12 h-32 sm:h-40 w-32 sm:w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        </section>

        {/* Responsive Summary Stats Grid */}
        <section className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-surface p-3.5 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bengali text-xs font-medium text-text-muted">
                      {card.title}
                    </p>
                    <p className="mt-1 font-heading text-xl sm:text-3xl font-bold text-text">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border ${card.bgClass} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={2.2} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Requests List Section */}
        <section className="mt-8 sm:mt-10">
          <div className="flex flex-row items-center justify-between border-b border-border/60 pb-3 sm:pb-4 gap-2">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-text">
                {user?.role === "provider"
                  ? "আসা অনুরোধসমূহ"
                  : "আমার অনুরোধসমূহ"}
              </h2>
              <p className="hidden sm:block font-bengali text-xs sm:text-sm text-text-muted mt-0.5">
                {user?.role === "provider"
                  ? "গ্রাহকদের সার্ভিস রিকুয়েস্ট গ্রহণ বা প্রত্যাখ্যান করুন।"
                  : "আপনার পাঠানো সার্ভিস রিকুয়েস্টগুলোর বর্তমান স্ট্যাটাস দেখুন।"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface border border-border px-3 py-1 font-bengali text-xs font-medium text-text-muted shadow-xs">
              মোট: <strong className="text-primary">{totalRequests}</strong> টি
            </span>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-36 sm:w-48 rounded-lg bg-border/50" />
                    <div className="h-5 w-16 sm:w-20 rounded-full bg-border/50" />
                  </div>
                  <div className="mt-4 h-4 w-28 rounded bg-border/40" />
                  <div className="mt-4 h-12 sm:h-16 w-full rounded-xl bg-border/30" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            /* Empty State */
            <div className="mt-6 sm:mt-8 rounded-2xl border border-dashed border-border/80 bg-surface px-4 py-12 sm:py-16 text-center">
              <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                <Inbox className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mt-3 sm:mt-4 font-heading text-base sm:text-lg font-bold text-text">
                কোনো অনুরোধ পাওয়া যায়নি
              </h3>
              <p className="mx-auto mt-1 max-w-sm font-bengali text-xs sm:text-sm text-text-muted">
                {user?.role === "provider"
                  ? "বর্তমানে আপনার কাছে কোনো সেবার অনুরোধ অপেক্ষমাণ নেই।"
                  : "আপনি এখনো কোনো সেবার জন্য অনুরোধ পাঠাননি।"}
              </p>
            </div>
          ) : (
            /* Request List */
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="group rounded-xl sm:rounded-2xl border border-border bg-surface p-4 sm:p-6 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:gap-4">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 sm:gap-3.5">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Wrench size={18} className="sm:hidden" />
                          <Wrench size={20} className="hidden sm:block" />
                        </div>
                        <div>
                          <h3 className="font-heading text-base sm:text-lg font-bold text-text leading-snug">
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
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-t border-border/40 pt-2.5 sm:pt-3 text-xs font-bengali text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <UserRound size={14} className="text-primary" />
                        <span>
                          {user?.role === "provider" ? "গ্রাহক: " : "সেবাদাতা: "}
                          <strong className="text-text font-semibold">
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
                            {new Date(request.createdAt).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Box */}
                    <div className="rounded-xl bg-background/60 p-3 sm:p-3.5 border border-border/40">
                      <p className="font-bengali text-xs sm:text-sm leading-relaxed text-text-muted">
                        {request.message || "কোনো অতিরিক্ত বার্তা নেই।"}
                      </p>
                    </div>

                    {/* Responsive Provider Actions */}
                    {user?.role === "provider" && request.status === "pending" && (
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                        <button
                          type="button"
                          disabled={updatingId === request._id}
                          onClick={() => handleStatusUpdate(request._id, "accepted")}
                          className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-3 py-2 sm:py-2.5 font-bengali text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === request._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                          <span>গ্রহণ করুন</span>
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === request._id}
                          onClick={() => handleStatusUpdate(request._id, "rejected")}
                          className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-rose-600 px-3 py-2 sm:py-2.5 font-bengali text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === request._id ? (
                            <Loader2 size={15} className="animate-spin" />
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