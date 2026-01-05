import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRemainingTokenTime } from "../utils/tokenValidator";
import { toast } from "react-toastify";
import { Clock, AlertTriangle } from "lucide-react";

const TokenExpiryWarning = () => {
  const { auth } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  useEffect(() => {
    if (!auth?.token) return;

    const checkWarning = () => {
      const remaining = getRemainingTokenTime(auth.token);
      const minutes = Math.floor(remaining / 60000);
      
      setRemainingMinutes(minutes);

      // Show warning if less than 5 minutes remaining
      if (remaining > 0 && remaining <= 5 * 60 * 1000) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Check immediately
    checkWarning();

    // Check every 30 seconds
    const interval = setInterval(checkWarning, 30000);

    return () => clearInterval(interval);
  }, [auth]);

  useEffect(() => {
    if (showWarning && remainingMinutes > 0) {
      toast.warning(
        `⚠️ Your session will expire in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}!`,
        {
          position: "top-right",
          autoClose: 5000,
          toastId: "token-expiry-warning", // Prevent duplicate toasts
        }
      );
    }
  }, [showWarning, remainingMinutes]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-lg p-4 max-w-sm z-50 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-400 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-900" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-900 mb-1">Session Expiring Soon</h4>
          <p className="text-sm text-yellow-800 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''} remaining
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            Please save your work. You'll be logged out automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryWarning;
