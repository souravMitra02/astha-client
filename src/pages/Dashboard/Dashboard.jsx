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
    (request) => request.status === "pending"
  ).length;

  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted"
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "rejected"
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
      bgClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      title: "প্রত্যাখ্যাত",
      value: rejectedRequests,
      icon: XCircle,
      bgClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "গৃহীত",
          message: "সেবাদাতা আপনার অনুরোধটি গ্রহণ করেছেন।",
          badgeClass:
            "border-success/20 bg-success/10 text-success",
          dotClass: "bg-success",
          cardClass:
            "border-success/20 hover:border-success/30",
        };

      case "rejected":
        return {
          label: "প্রত্যাখ্যাত",
          message: "সেবাদাতা এই অনুরোধটি গ্রহণ করতে পারেননি।",
          badgeClass:
            "border-danger/20 bg-danger/10 text-danger",
          dotClass: "bg-danger",
          cardClass:
            "border-danger/20 hover:border-danger/30",
        };

      default:
        return {
          label: "অপেক্ষমাণ",
          message: "সেবাদাতা আপনার অনুরোধটি পর্যালোচনা করছেন।",
          badgeClass:
            "border-primary/20 bg-primary/10 text-primary",
          dotClass: "bg-primary",
          cardClass:
            "border-primary/20 hover:border-primary/30",
        };
    }
  };

  return (
    <main className="min-h-screen bg-background py-4 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 font-bengali text-xs font-medium text-text-muted transition-all hover:bg-background hover:text-primary hover:shadow-xs active:scale-95 sm:text-sm"
          >
            <ArrowLeft size={16} />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl sm:p-8">
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
            <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
              {requests.map((request) => {
                const statusConfig = getStatusConfig(request.status);

                return (
                  <article
                    key={request._id}
                    className={`group overflow-hidden rounded-2xl border bg-surface shadow-xs transition-all duration-200 hover:shadow-md ${statusConfig.cardClass}`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
                              <Wrench size={18} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-heading text-base font-bold leading-snug text-text sm:text-lg">
                                {request.serviceTitle || "সেবা অনুরোধ"}
                              </h3>

                              {request.serviceCategory && (
                                <span className="mt-0.5 block font-bengali text-xs text-text-muted">
                                  {request.serviceCategory}
                                </span>
                              )}
                            </div>
                          </div>

                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-bengali text-xs font-semibold ${statusConfig.badgeClass}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass} ${
                                request.status === "pending"
                                  ? "animate-pulse"
                                  : ""
                              }`}
                            />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div
                          className={`rounded-xl border px-3.5 py-2.5 font-bengali text-xs sm:px-4 sm:py-3 sm:text-sm ${statusConfig.badgeClass}`}
                        >
                          {statusConfig.message}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3 font-bengali text-xs text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <UserRound
                              size={14}
                              className="shrink-0 text-primary"
                            />

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
                              <Calendar
                                size={14}
                                className="shrink-0"
                              />

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

                        <div>
                          <p className="mb-2 font-bengali text-xs font-semibold text-text-muted">
                            আপনার বার্তা
                          </p>

                          <div className="rounded-xl border border-border bg-background p-3.5 sm:p-4">
                            <p className="font-bengali text-xs leading-7 text-text sm:text-sm">
                              {request.message ||
                                "কোনো অতিরিক্ত বার্তা নেই।"}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-border/50 pt-4">
                          <Link
                            to={`/requests/${request._id}`}
                            className="flex w-full items-center justify-center rounded-xl border border-border bg-surface px-3 py-2.5 font-bengali text-xs font-semibold text-text transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-[0.99] sm:text-sm"
                          >
                            বিস্তারিত দেখুন
                          </Link>
                        </div>

                        {user?.role === "provider" &&
                          request.status === "pending" && (
                            <div className="grid grid-cols-2 gap-2.5 border-t border-border/50 pt-4">
                              <button
                                type="button"
                                disabled={updatingId === request._id}
                                onClick={() =>
                                  handleStatusUpdate(
                                    request._id,
                                    "accepted"
                                  )
                                }
                                className="flex items-center justify-center gap-1.5 rounded-xl bg-success px-3 py-2.5 font-bengali text-xs font-semibold text-white shadow-xs transition-all hover:bg-success/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm"
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
                                className="flex items-center justify-center gap-1.5 rounded-xl bg-danger px-3 py-2.5 font-bengali text-xs font-semibold text-white shadow-xs transition-all hover:bg-danger/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm"
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
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;