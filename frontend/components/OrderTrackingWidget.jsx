import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  Loader2,
  Package,
  Search,
  Truck,
  X,
} from "lucide-react";

const getOrderStatus = (order) =>
  order?.order_status || order?.status || "pending";

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) =>
  String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const OrderTrackingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const fetchOrder = async (lookupValue, lookupType) => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
    const endpoint =
      lookupType === "number"
        ? `/orders/number/${encodeURIComponent(lookupValue)}`
        : `/orders/order/${encodeURIComponent(lookupValue)}`;

    const response = await fetch(`${apiBase}${endpoint}`);
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Order not found");
    }

    return result.data;
  };

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    const lookupValue = orderId.trim();
    if (!lookupValue) {
      setError("Enter your order ID first.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const firstLookup = lookupValue.includes("-") ? "number" : "id";
      const secondLookup = firstLookup === "number" ? "id" : "number";

      try {
        setOrder(await fetchOrder(lookupValue, firstLookup));
      } catch (firstError) {
        setOrder(await fetchOrder(lookupValue, secondLookup));
      }
    } catch (error) {
      setError(error.message || "Unable to find this order.");
    } finally {
      setLoading(false);
    }
  };

  const status = getOrderStatus(order);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="hidden sm:flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        aria-label="Track order"
      >
        <span className="hidden xl:inline">Track Order</span>
      </button>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="sm:hidden p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
        aria-label="Track order"
      >
        <Package className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-gray-200 bg-white shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Track Your Order
              </h3>
              <p className="text-xs text-gray-500">
                Paste the order ID from your receipt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-800"
              aria-label="Close order tracking"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleTrackOrder} className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="ORD1779190739870599"
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:opacity-60"
                aria-label="Search order"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {order && (
              <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Order ID</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.order_id || order.order_number}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {normalizeStatus(status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Order Number</p>
                    <p className="font-medium text-gray-900">
                      {order.order_number || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="font-medium text-gray-900">
                      {order.payment_status || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Placed On</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-white p-3 text-sm text-gray-700">
                  <Truck className="mt-0.5 h-4 w-4 text-green-600" />
                  <p>
                    Latest status:{" "}
                    <span className="font-semibold text-gray-900">
                      {normalizeStatus(status)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingWidget;
