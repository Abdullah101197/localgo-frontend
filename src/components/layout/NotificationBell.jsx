import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Info } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusIcon = (type) => {
    if (type === "order_status") {
      return <Info className="w-4 h-4 text-blue-500" />;
    }
    return <Bell className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 group"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">
                Notifications
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {unreadCount} unread alerts
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`w-full text-left p-5 flex gap-4 hover:bg-gray-50 transition-colors relative group ${n.is_read ? "" : "bg-primary-50/30"}`}
                    onClick={() => {
                      if (n.is_read === false) markAsRead(n.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (n.is_read === false) markAsRead(n.id);
                      }
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.is_read ? "bg-white shadow-sm" : "bg-gray-100"}`}
                    >
                      {getStatusIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-sm font-black text-gray-900 truncate pr-4">
                          {n.title}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 whitespace-nowrap mt-0.5">
                          {formatDistanceToNow(new Date(n.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed mb-2 line-clamp-2">
                        {n.message}
                      </p>
                      {n.data?.order_id && (
                        <Link
                          to={`/orders/${n.data.order_id}`}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:gap-2 transition-all"
                        >
                          View Order <Clock className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    {n.is_read ? null : (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                  <Bell className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-sm font-black text-gray-900 mb-1">
                  No notifications yet
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  We&apos;ll notify you when your order status changes
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
              >
                View full profile
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
