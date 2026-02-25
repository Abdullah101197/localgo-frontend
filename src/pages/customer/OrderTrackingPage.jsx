import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  ArrowLeft,
  Bike,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
  Navigation,
  Phone,
} from "lucide-react";
import api from "../../api/axios";
import ChatOverlay from "../../components/common/ChatOverlay";

// Custom icons for the map
const riderIcon = new L.DivIcon({
  html: `<div class="bg-primary-600 p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
           </div>`,
  className: "custom-rider-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const deliveryIcon = new L.DivIcon({
  html: `<div class="bg-gray-900 p-2 rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
  className: "custom-delivery-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const shopIcon = new L.DivIcon({
  html: `<div class="bg-orange-500 p-2 rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
           </div>`,
  className: "custom-shop-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Component to auto-center map when coordinates change
function MapAutoCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 2 });
    }
  }, [center, map]);
  return null;
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
    // Polling for real-time updates
    const interval = setInterval(fetchOrderDetails, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [fetchOrderDetails]);

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="font-black text-gray-900 uppercase tracking-widest text-sm">
          Initializing Tracker...
        </p>
      </div>
    );
  }

  if (!order) return <div>Order not found.</div>;

  const riderPos =
    order.rider_latitude && order.rider_longitude
      ? [parseFloat(order.rider_latitude), parseFloat(order.rider_longitude)]
      : null;

  const destPos =
    order.delivery_latitude && order.delivery_longitude
      ? [
          parseFloat(order.delivery_latitude),
          parseFloat(order.delivery_longitude),
        ]
      : null;

  const shopPos =
    order.shop?.latitude && order.shop?.longitude
      ? [parseFloat(order.shop.latitude), parseFloat(order.shop.longitude)]
      : null;

  const statuses = [
    { id: "pending", label: "Placed", icon: Package },
    { id: "accepted", label: "Confirmed", icon: CheckCircle2 },
    { id: "ready", label: "Preparing", icon: Clock },
    { id: "pickup", label: "On the Way", icon: Bike },
    { id: "delivered", label: "Delivered", icon: MapPin },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.id === order.status);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar / Info Section */}
      <div className="w-full lg:w-96 bg-white shadow-2xl z-20 flex flex-col h-1/2 lg:h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Tracking Order
            </p>
            <h2 className="text-xl font-black text-gray-900">#{order.id}</h2>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8">
          {/* Status Timeline */}
          <div className="relative space-y-6">
            <div className="absolute left-6 top-2 bottom-2 w-1 bg-gray-100 -z-0"></div>
            <div
              className="absolute left-6 top-2 w-1 bg-primary-600 -z-0 transition-all duration-1000"
              style={{
                height: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
              }}
            ></div>

            {statuses.map((s, index) => {
              const isPast = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const Icon = s.icon;

              return (
                <div
                  key={s.id}
                  className="flex items-center gap-6 relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                      isCurrent
                        ? "bg-primary-600 text-white scale-110 shadow-primary-200"
                        : isPast
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-50 text-gray-300"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-black uppercase tracking-widest ${isPast ? "text-gray-900" : "text-gray-300"}`}
                    >
                      {s.label}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] font-bold text-primary-600 mt-1 flex items-center gap-1 italic">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-ping"></span>
                        Actual Status
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Rider Info if applicable */}
          {order.rider && (
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Bike className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Your Rider
                  </p>
                  <h4 className="text-lg font-black text-gray-900">
                    LocalGo Hero
                  </h4>
                  <p className="text-xs font-bold text-gray-500">
                    Fast & Secure Delivery
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-white border border-gray-200 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95 shadow-sm">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="relative flex-1 bg-white border border-gray-200 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-95 shadow-sm"
                >
                  Chat
                  {order.unread_messages_count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                      {order.unread_messages_count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          <ChatOverlay
            orderId={id}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            recipientName="Rider"
          />

          <div className="bg-primary-600 rounded-3xl p-6 text-white text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
              Estimated Arrival
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter">
              15-20 MIN
            </h3>
          </div>
        </div>

        <div className="p-6 bg-gray-50 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Last Update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative h-1/2 lg:h-full">
        <MapContainer
          center={riderPos || destPos || [33.6844, 73.0479]}
          zoom={15}
          className="h-full w-full grayscale-[0.2] contrast-[1.1]"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {destPos && (
            <Marker position={destPos} icon={deliveryIcon}>
              <Popup className="font-bold">Your Delivery Point</Popup>
            </Marker>
          )}

          {shopPos && (
            <Marker position={shopPos} icon={shopIcon}>
              <Popup className="font-bold">{order.shop?.name}</Popup>
            </Marker>
          )}

          {riderPos && (
            <>
              <Marker position={riderPos} icon={riderIcon}>
                <Popup className="font-bold">Your Rider is here!</Popup>
              </Marker>
              <MapAutoCenter center={riderPos} />
            </>
          )}
        </MapContainer>

        {/* Floating Map Controls */}
        <div className="absolute top-6 right-6 space-y-4">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
              <Navigation className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Rider Speed
              </p>
              <p className="text-lg font-black text-gray-900 leading-none">
                35 km/h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
