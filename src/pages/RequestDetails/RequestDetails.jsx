import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import { getSingleRequest } from "../../services/requestService";

const RequestDetails = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await getSingleRequest(id);
        setRequest(data.request);
      } catch (error) {
        console.error("Failed to fetch request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const getStatusStyle = (status) => {
    if (status === "accepted") {
      return "bg-success/10 text-success";
    }

    if (status === "rejected") {
      return "bg-danger/10 text-danger";
    }

    return "bg-primary/10 text-primary";
  };

  const getStatusText = (status) => {
    if (status === "accepted") {
      return "গৃহীত";
    }

    if (status === "rejected") {
      return "প্রত্যাখ্যাত";
    }

    return "অপেক্ষমাণ";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-bengali text-text-muted">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-text">
            অনুরোধের বিস্তারিত
          </h1>

          <p className="mt-1 font-bengali text-sm text-text-muted">
            আপনার সেবা অনুরোধের বিস্তারিত তথ্য
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-text">
              সেবা অনুরোধ
            </h2>

            <span
              className={`rounded-full px-3 py-1 font-bengali text-sm font-medium ${getStatusStyle(
                request?.status
              )}`}
            >
              {getStatusText(request?.status)}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="font-bengali text-sm text-text-muted">
                সেবার নাম
              </p>

              <p className="mt-1 font-bengali text-base font-medium text-text">
                {request?.serviceTitle}
              </p>
            </div>

            <div>
              <p className="font-bengali text-sm text-text-muted">
                সেবার ধরন
              </p>

              <p className="mt-1 font-bengali text-base text-text">
                {request?.serviceCategory}
              </p>
            </div>

           <div className="border-t border-border pt-5">
  <p className="mb-3 font-bengali text-sm font-medium text-text-muted">
    সেবাদাতা
  </p>

  <div className="rounded-xl border border-border bg-background p-4">
    <div className="space-y-4">
      {/* Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <User size={18} className="text-primary" />
        </div>

        <div className="min-w-0">
          <p className="font-bengali text-xs text-text-muted">
            নাম
          </p>
          <p className="mt-0.5 font-bengali text-sm font-semibold text-text">
            {request?.providerName}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Mail size={18} className="text-primary" />
        </div>

        <div className="min-w-0">
          <p className="font-bengali text-xs text-text-muted">
            ইমেইল
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-text">
            {request?.providerEmail}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Phone size={18} className="text-primary" />
        </div>

        <div>
          <p className="font-bengali text-xs text-text-muted">
            ফোন
          </p>
          <p className="mt-0.5 text-sm font-medium text-text">
            {request?.providerPhone}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

            <div className="border-t border-border pt-5">
              <p className="font-bengali text-sm text-text-muted">
                আপনার বার্তা
              </p>

              <p className="mt-1 font-bengali text-base text-text">
                {request?.message}
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <p className="font-bengali text-sm text-text-muted">
                Request ID
              </p>

              <p className="mt-1 break-all text-sm text-text">
                {request?._id}
              </p>
            </div>

            <div>
              <p className="font-bengali text-sm text-text-muted">
                অনুরোধের তারিখ
              </p>

              <p className="mt-1 font-bengali text-base text-text">
                {new Date(request?.createdAt).toLocaleDateString("bn-BD")}
              </p>
            </div>

            {request?.updatedAt && (
              <div>
                <p className="font-bengali text-sm text-text-muted">
                  সর্বশেষ আপডেট
                </p>

                <p className="mt-1 font-bengali text-base text-text">
                  {new Date(request.updatedAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;