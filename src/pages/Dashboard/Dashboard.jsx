import { useEffect, useState } from "react";
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
        const data =
          user?.role === "provider"
            ? await getProviderRequests()
            : await getMyRequests();

        setRequests(data.requests);
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
          request._id === requestId
            ? { ...request, status }
            : request
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-bengali text-sm font-medium text-primary">
          ড্যাশবোর্ড
        </p>

        <h1 className="mt-2 font-heading text-3xl font-bold text-text sm:text-4xl">
          স্বাগতম, {user?.name}
        </h1>

        <p className="mt-2 font-bengali text-text-muted">
          আপনার সেবা এবং অনুরোধগুলো এখান থেকে পরিচালনা করুন।
        </p>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-text">
              {user?.role === "provider"
                ? "আমার কাছে আসা অনুরোধ"
                : "আমার অনুরোধ"}
            </h2>

            <span className="rounded-full bg-primary/10 px-3 py-1 font-bengali text-sm font-semibold text-primary">
              {requests.length}টি
            </span>
          </div>

          {loading ? (
            <p className="mt-6 font-bengali text-text-muted">
              অনুরোধগুলো লোড হচ্ছে...
            </p>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-8 text-center">
              <p className="font-bengali text-text-muted">
                {user?.role === "provider"
                  ? "এখনো কোনো অনুরোধ আসেনি।"
                  : "এখনো কোনো সেবার অনুরোধ করেননি।"}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text">
                        {request.serviceTitle || "সেবা অনুরোধ"}
                      </h3>

                      {request.serviceCategory && (
                        <p className="mt-1 font-bengali text-sm text-text-muted">
                          {request.serviceCategory}
                        </p>
                      )}

                      <p className="mt-4 font-bengali text-sm text-text">
                        <span className="font-semibold">
                          {user?.role === "provider"
                            ? "গ্রাহক:"
                            : "সেবাদাতা:"}
                        </span>{" "}
                        {user?.role === "provider"
                          ? request.userName || "গ্রাহক"
                          : request.providerName || "সেবাদাতা"}
                      </p>

                      <p className="mt-3 font-bengali text-sm leading-6 text-text-muted">
                        {request.message}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 self-start rounded-full px-3 py-1 font-bengali text-sm font-semibold ${
                        request.status === "accepted"
                          ? "bg-success/10 text-success"
                          : request.status === "rejected"
                            ? "bg-danger/10 text-danger"
                            : "bg-background text-text-muted"
                      }`}
                    >
                      {request.status === "accepted"
                        ? "গৃহীত"
                        : request.status === "rejected"
                          ? "প্রত্যাখ্যাত"
                          : "অপেক্ষমাণ"}
                    </span>
                  </div>

                  {user?.role === "provider" &&
                    request.status === "pending" && (
                      <div className="mt-5 flex gap-3 border-t border-border pt-5">
                        <button
                          type="button"
                          disabled={updatingId === request._id}
                          onClick={() =>
                            handleStatusUpdate(
                              request._id,
                              "accepted"
                            )
                          }
                          className="rounded-lg bg-success px-4 py-2 font-bengali text-sm font-semibold text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === request._id
                            ? "আপডেট হচ্ছে..."
                            : "গ্রহণ করুন"}
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
                          className="rounded-lg bg-danger px-4 py-2 font-bengali text-sm font-semibold text-surface transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === request._id
                            ? "আপডেট হচ্ছে..."
                            : "প্রত্যাখ্যান করুন"}
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;