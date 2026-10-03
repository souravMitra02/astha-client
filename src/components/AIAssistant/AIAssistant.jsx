import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { askAI } from "../../services/aiService";
import { findAvailableServices } from "../../services/serviceService";
import { createRequest } from "../../services/requestService";
import Swal from "sweetalert2";

const categoryLabels = {
  electrician: "ইলেকট্রিক্যাল",
  plumber: "প্লাম্বার",
  "ac-service": "AC সার্ভিস",
  cleaning: "ক্লিনিং",
  carpenter: "কার্পেন্টার",
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [location, setLocation] = useState(null);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestedProviders, setRequestedProviders] = useState([]);
  
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "শুভ রাত্রি";

  if (hour >= 5 && hour < 12) {
    greeting = "শুভ সকাল";
  } else if (hour >= 12 && hour < 17) {
    greeting = "শুভ দুপুর";
  } else if (hour >= 17 && hour < 19) {
    greeting = "শুভ বিকেল";
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
      }
    );
  };

  const handleSendMessage = async () => {
  if (!message.trim()) return;

  const userMessage = message;

  setMessages((prev) => [
    ...prev,
    {
      type: "user",
      text: userMessage,
    },
  ]);

  setMessage("");
  setIsLoading(true);

  try {
    const response = await askAI(userMessage);

    const category = response.result.category;

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: response.result.problem,
        category,
      },
    ]);

    if (location && category !== "unknown") {
      const providerResponse = await findAvailableServices(
        category,
        location.latitude,
        location.longitude
      );

      setProviders(providerResponse.providers);
    }
  } catch (error) {
    console.error("AI error:", error);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: "দুঃখিত, এই মুহূর্তে আপনার অনুরোধটি প্রক্রিয়া করা যাচ্ছে না।",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const handleRequest = async (provider) => {
  try {
    const response = await createRequest(
      provider._id,
      messages.find((item) => item.type === "user")?.text || ""
    );

    setRequestedProviders((prev) => [...prev, provider._id]);

    await Swal.fire({
      icon: "success",
      title: "অনুরোধ সফল হয়েছে",
      text: response.message,
      confirmButtonText: "ঠিক আছে",
    });
  } catch (error) {
    console.error("Create request error:", error);

    Swal.fire({
      icon: "error",
      title: "অনুরোধ ব্যর্থ হয়েছে",
      text:
        error.response?.data?.message ||
        "অনুরোধ পাঠাতে সমস্যা হয়েছে",
      confirmButtonText: "ঠিক আছে",
    });
  }
};

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
          <div className="border-b border-border p-4">
            <h3 className="font-heading text-lg font-bold text-text">
              আস্হা AI
            </h3>

            <p className="mt-1 font-bengali text-sm text-text-muted">
              আপনার প্রয়োজনের সেবা খুঁজে দিতে আমি আছি।
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto p-4">
            <p className="rounded-xl bg-background p-3 font-bengali text-sm leading-6 text-text">
              {greeting}, {user?.name || "আপনাকে"}! 👋
              <br />
              আমি আস্হা AI। কীভাবে সাহায্য করতে পারি?
            </p>

           {messages.map((item, index) => (
  <div
    key={index}
    className={`mt-3 rounded-xl p-3 font-bengali text-sm ${
      item.type === "user"
        ? "ml-8 bg-primary text-surface"
        : "mr-8 bg-background text-text"
    }`}
  >
    {item.text}

    {item.type === "ai" && item.category && (
      <p className="mt-2 text-xs text-text-muted">
        সেবার ধরন:{" "}
        {categoryLabels[item.category] || item.category}
      </p>
    )}
  </div>
))}

{isLoading && (
  <div className="mt-3 mr-8 rounded-xl bg-background p-3 font-bengali text-sm text-text-muted">
    আস্থা AI আপনার অনুরোধটি বিশ্লেষণ করছে...
  </div>
)}

           {providers.length > 0 ? (
  <div className="mt-4 space-y-3">
    <p className="font-bengali text-sm font-semibold text-text">
      আপনার জন্য কাছাকাছি সেবা পাওয়া গেছে:
    </p>

    {providers.map((provider) => (
      <div
        key={provider._id}
        className="rounded-xl border border-border bg-surface p-4"
      >
        <h4 className="font-heading font-bold text-text">
          {provider.title}
        </h4>

        <p className="mt-1 font-bengali text-sm text-text-muted">
          সেবাদাতা: {provider.provider.name}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-bengali text-sm text-text-muted">
            {provider.distance.toFixed(1)} km দূরে
          </span>

          <span className="font-heading font-bold text-primary">
            ৳{provider.price}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleRequest(provider)}
          disabled={requestedProviders.includes(provider._id)}
          className={`mt-3 w-full rounded-lg px-4 py-2.5 font-bengali text-sm font-semibold text-surface transition ${
            requestedProviders.includes(provider._id)
              ? "cursor-not-allowed bg-success"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {requestedProviders.includes(provider._id)
            ? "অনুরোধ পাঠানো হয়েছে ✓"
            : "সেবা নিন"}
        </button>
      </div>
    ))}
  </div>
) : (
  location && (
    <div className="mt-4 rounded-xl border border-border bg-background p-4">
      <p className="font-bengali text-sm leading-6 text-text-muted">
        দুঃখিত, এই মুহূর্তে আপনার কাছাকাছি কোনো সেবাদাতা পাওয়া যায়নি।
        কিছুক্ষণ পরে আবার চেষ্টা করুন।
      </p>
    </div>
  )
)}

            <button
              type="button"
              onClick={getUserLocation}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-bengali font-semibold text-surface transition hover:bg-primary-hover"
            >
              📍 আমার অবস্থান ব্যবহার করুন
            </button>

            {location && (
              <div className="mt-3 rounded-xl bg-background p-3 font-bengali text-sm text-text">
                <p>অবস্থান পাওয়া গেছে ✅</p>

                <p className="mt-1 text-text-muted">
                  Latitude: {location.latitude}
                </p>

                <p className="text-text-muted">
                  Longitude: {location.longitude}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-border p-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার সমস্যাটি লিখুন..."
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 font-bengali text-sm text-text outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              className="rounded-xl bg-primary px-4 py-2.5 font-bengali font-semibold text-surface transition hover:bg-primary-hover"
            >
              পাঠান
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-surface shadow-lg transition hover:bg-primary-hover"
        aria-label="AI Assistant"
      >
        AI
      </button>
    </>
  );
};

export default AIAssistant;