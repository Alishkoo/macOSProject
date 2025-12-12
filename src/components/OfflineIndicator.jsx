import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      setShowNotification(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showNotification) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-9999 transition-all duration-300 ${
        showNotification
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg backdrop-blur-md ${
          isOnline
            ? "bg-green-500/90 text-white"
            : "bg-yellow-500/90 text-white"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi size={20} />
            <span className="font-semibold">Back Online</span>
          </>
        ) : (
          <>
            <WifiOff size={20} />
            <span className="font-semibold">You're Offline</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
