"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X, Phone, Clock } from "lucide-react";
import Image from "next/image";
import user from "@/assets/temi.png";
import clsx from "clsx";
import MapWithRoute from "@/components/Overlays/MapWithRoute"; // your custom component
import { Button } from "@/components/ui/button";
import ArrivalNotification from './../../../components/orders-page/ArrivalNotification';
import ConfirmPickupModal from "./../../../components/orders-page/ConfirmPickupModal";

type ActiveOrderType = {
  id?: number;
  from_location?: string;
  to_location?: string;
  order_id?: string;
  order_created?: string;
  order_fare?: string;
  pickup_time?: string;
  dropoff_time?: string;
  status?: string;
  distance?: number;
  user_name?: string;
  user_image?: string;
  user_phone?: string;
};

export const OrderDetailsModal = ({
  isOpen,
  setDetailsModalOpen,
}: {
  isOpen: boolean;
  setDetailsModalOpen: (value: boolean) => void;
}) => {
  const router = useRouter();
  const { package_id } = router.query;

  const [activeOrder, setActiveOrder] = useState<ActiveOrderType | null>(null);
  const [customerNotified, setCustomerNotified] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [confirmPickupModalOpen, setConfirmPickupModalOpen] = useState(false);

  useEffect(() => {
    if (!package_id) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://spida.africa/kaya-api/rider/order-details.php?package_id=${package_id}`
        );
        const data = await response.json();
        if (data.success) {
          setActiveOrder(data.order);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrderDetails();
  }, [package_id]);

  const handleConfirmDelivery = async () => {
    try {
      const response = await fetch("https://spida.africa/kaya-api/rider/confirm-delivery.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ package_id }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Delivery confirmed successfully!");
        router.push("/rider/home");
      } else {
        alert("Failed to confirm delivery.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while confirming delivery.");
    }
  };

  if (!activeOrder) return null;

  return (
    <div
      onClick={() => setDetailsModalOpen(false)}
      className={clsx(
        "fixed inset-0 z-50 bg-black/30 flex items-center justify-center transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg h-[90%] overflow-y-auto rounded-xl shadow-lg relative"
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <X className="cursor-pointer" onClick={() => setDetailsModalOpen(false)} />
        </div>

        <div className="p-4">
          <MapWithRoute from={activeOrder.from_location} to={activeOrder.to_location} />

          <div className="mt-6">
            <h3 className="text-sm font-bold text-primary mb-4">Customer Details</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={activeOrder.user_image || user}
                  alt="Customer"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="font-medium">{activeOrder.user_name}</span>
              </div>
              <Phone
                className="cursor-pointer"
                onClick={() => setPhoneModalOpen(true)}
              />
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="Order ID" value={activeOrder.order_id} />
              <DetailRow label="Fare" value={`NGN ${activeOrder.order_fare}`} />
              <DetailRow label="Pickup" value={activeOrder.from_location} />
              <DetailRow label="Drop-off" value={activeOrder.to_location} />
              <DetailRow label="Distance" value={`${activeOrder.distance?.toFixed(1)} km`} />
              <DetailRow label="Description" value="Document" />
            </div>

            <Button
              onClick={handleConfirmDelivery}
              className="w-full mt-6 bg-green-600 text-white hover:bg-green-700"
            >
              Confirm Delivery
            </Button>

            <Button
              onClick={() => router.push("/rider/home")}
              variant="outline"
              className="w-full mt-3"
            >
              Back to Home
            </Button>
          </div>

          {customerNotified && <ArrivalNotification />}
        </div>

        {confirmPickupModalOpen && (
          <ConfirmPickupModal
            modalOpen={confirmPickupModalOpen}
            setModalOpen={setConfirmPickupModalOpen}
            activeOrder={activeOrder}
            setActiveOrder={setActiveOrder}
            mainText="Confirm Delivery?"
            desc="Please ensure everything is in order before completing this delivery."
            continueFn={handleConfirmDelivery}
            cancelFn={() => setConfirmPickupModalOpen(false)}
          />
        )}

        {phoneModalOpen && (
          <div
            onClick={() => setPhoneModalOpen(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-xl text-center w-[90%] max-w-sm"
            >
              <h2 className="text-xl font-semibold">Customer Phone</h2>
              <p className="text-gray-700 mt-2">{activeOrder.user_phone || "N/A"}</p>
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${activeOrder.user_phone}`}
                  className="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Call Now
                </a>
                <button
                  onClick={() => setPhoneModalOpen(false)}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
  <p className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </p>
);
