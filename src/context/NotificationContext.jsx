import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const lastSeenIdRef = useRef(0);

  const addToast = useCallback((notification) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/notifications");
      const data = res.data;

      // Check for new notifications to trigger "Toasts"
      if (lastSeenIdRef.current > 0 && data.length > 0) {
        const news = data.filter(
          (n) => n.id > lastSeenIdRef.current && !n.is_read,
        );
        news.forEach((n) => addToast(n));
      }

      if (data.length > 0) {
        const maxId = Math.max(...data.map((n) => n.id));
        lastSeenIdRef.current = Math.max(lastSeenIdRef.current, maxId);
      }

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [isAuthenticated, addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      lastSeenIdRef.current = 0;
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      refresh: fetchNotifications,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Live Toasts Overlay */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-[1.5rem] p-5 flex gap-4 overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200 flex-shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest">
                      {toast.title}
                    </p>
                    <button
                      onClick={() =>
                        setToasts((prev) =>
                          prev.filter((t) => t.id !== toast.id),
                        )
                      }
                      className="text-gray-400 hover:text-gray-900 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-2 pr-4">
                    {toast.message}
                  </p>
                  {toast.data?.order_id && (
                    <Link
                      to={`/orders/${toast.data.order_id}`}
                      className="text-[10px] font-black text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                    >
                      Track Order →
                    </Link>
                  )}
                </div>
                <div
                  className="absolute left-0 bottom-0 h-1 bg-primary-600 animate-[progress_5s_linear_forwards]"
                  style={{ width: "100%" }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
