import React, { useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";

const TrackOrder = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [trackingData, setTrackingData] = useState({
    orderId: "",
    email: "",
  });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!trackingData.orderId || !trackingData.email) {
      props.toaster?.({
        type: "error",
        message: "Please enter both Order ID and Email",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await Api("post", "trackGuestOrder", trackingData, router);
      if (response.status) {
        setOrder(response.data);
      } else {
        props.toaster?.({
          type: "error",
          message: "Order not found or email doesn't match",
        });
      }
    } catch (error) {
      props.toaster?.({
        type: "error",
        message: error.message || "Failed to track order",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "preparing":
        return "text-orange-600 bg-orange-100";
      case "ready":
        return "text-green-600 bg-green-100";
      case "delivered":
        return "text-green-800 bg-green-200";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {t("Track Your Order")}
          </h1>

          <form onSubmit={handleTrackOrder} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("Order ID")}
              </label>
              <input
                type="text"
                placeholder="e.g., OOR-251216-1234-01"
                value={trackingData.orderId}
                onChange={(e) =>
                  setTrackingData({ ...trackingData, orderId: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("Email")}
              </label>
              <input
                type="email"
                placeholder="your-email@example.com"
                value={trackingData.email}
                onChange={(e) =>
                  setTrackingData({ ...trackingData, email: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-green text-gray-900 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-custom-green text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? t("Tracking...") : t("Track Order")}
            </button>
          </form>

          {order && (
            <div className="border-t pt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {t("Order Details")}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">{t("Order ID")}:</span>
                    <p className="text-gray-800">{order.orderId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{t("Status")}:</span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{t("Date")}:</span>
                    <p className="text-gray-800">{order.orderDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{t("Time")}:</span>
                    <p className="text-gray-800">{order.orderTime}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{t("Total")}:</span>
                    <p className="text-gray-800">INR {order.total}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{t("Payment")}:</span>
                    <p className="text-gray-800">{order.paymentStatus || "Pending"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-900">{t("Items Ordered")}</h3>
                <div className="space-y-2">
                  {order.productDetail?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-700">
                          {t("Quantity")}: {item.qty}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">INR {item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              {order.Local_address && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">{t("Delivery Address")}</h3>
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    <p className="text-gray-800">{order.Local_address.address}</p>
                    <p className="text-gray-800">
                      {order.Local_address.city}, {order.Local_address.state}{" "}
                      {order.Local_address.zipcode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
