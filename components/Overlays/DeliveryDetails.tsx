"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Actions, DetailsLayout, ViewMapInFullMode } from "@/app/shared";
import { MiniMap, MoneyIcon, Stars } from "@/assets";
import { Dot, Edit3, Plus } from "lucide-react";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import DynamicOverlay from "./DynamicOverlay";
import { SuggestPrice } from "./SuggestPrice";
import { OrderDetails } from "./OrderDetails";
import Link from "next/link";
import {MapWithRoute} from "./MapWithRoute";

type Package = {
  id?: string;
  from_location: string;
  to_location: string;
  package_category: string;
  package_description: string;
  price: string;
  payment_method: string;
  sender_phone: string;
  recipient_phone: string;
  dynamic_stops: string[];
};

export function DeliveryDetails({
  actions,
  children,
  onOpenChange,
  open,
  withMoreActions = true,
  type = "delivery",
  data,
}: PropsWithChildren<{
  onOpenChange?(open: boolean): void;
  open?: boolean;
  actions?: Actions;
  withMoreActions?: boolean;
  type?: "delivery" | "order";
  data?: Package;
}>) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [dynamicStops, setDynamicStops] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("online-payment");
  const [userId, setUserId] = useState("");
  const [packageCategory, setPackageCategory] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [price, setPrice] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFromLocation(sessionStorage.getItem("fromLocation") || "");
      setToLocation(sessionStorage.getItem("toLocation") || "");
      setDynamicStops(JSON.parse(sessionStorage.getItem("dynamicStops") || "[]"));
      setPaymentMethod(sessionStorage.getItem("paymentMethod") || "online-payment");
      setUserId(sessionStorage.getItem("userId") || "");
      setPackageCategory(sessionStorage.getItem("packageCategory") || "");
      setPackageDescription(sessionStorage.getItem("packageDescription") || "");
      setPrice(sessionStorage.getItem("price") || "");
      setSenderPhone(sessionStorage.getItem("senderPhone") || "");
      setRecipientPhone(sessionStorage.getItem("recipientPhone") || "");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("paymentMethod", paymentMethod);
    }
  }, [paymentMethod]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://jbuit.org/api/create-package.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          user_id: userId,
          from_location: fromLocation,
          to_location: toLocation,
          package_category: packageCategory,
          package_description: packageDescription,
          price: price,
          payment_method: paymentMethod,
          sender_phone: senderPhone,
          recipient_phone: recipientPhone,
          dynamic_stops: JSON.stringify(dynamicStops),
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Package created successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating package:", error);
      alert("There was an error submitting the package.");
    }
  };

  const stopCount = dynamicStops.length;

  return (
    <DynamicOverlay onOpenChange={onOpenChange} open={open} trigger={children}>
      <DetailsLayout hide={() => actions?.close?.()} title={type === "delivery" ? "Delivery Details" : "Order Details"}>
        <div className="w-full relative">
          <MapWithRoute from={fromLocation} to={toLocation} />
          <ViewMapInFullMode userType="passenger" />
        </div>

        <div className="space-y-4">
          {type === "order" && (
            <div className="flex items-center justify-between">
              <p className="text-gray-400">OrderID</p>
              <p className="font-semibold">#453GBR89</p>
            </div>
          )}

          {!withMoreActions && type !== "order" && (
            <div className="flex items-center justify-between">
              <p className="text-gray-400">Price</p>
              <p className="font-semibold">{price}</p>
            </div>
          )}

          <DetailRow label="Current Location" value={fromLocation} />
          <DetailRow label="Destination" value={toLocation} />
          <DetailRow label="Number of stops" value={`${stopCount}`} />
          <DetailRow label="Payment Method" value={paymentMethod} />

          {type === "order" && (
            <>
              <DetailRow label="Order Date" value="20 December 2024.....12:30pm" />
              <DetailRow label="Order Status" value="completed" status="success" />
              <DetailRow label="Rider Name" value="Matthew Aaron" />
              <DetailRow label="Rider ID" value="RD6799909" />
              <DetailRow label="Rider rating" value="4 stars" />
            </>
          )}
        </div>

        {type === "order" && <Button>Rebook Order</Button>}

        {withMoreActions && (
          <>
            <OrderDetails actions={actions} onOpenChange={onOpenChange} open={open}>
              <ActionButton label="Enter Order Details" />
            </OrderDetails>
            <SuggestPrice actions={actions} onOpenChange={onOpenChange} open={open}>
              <PriceSuggestionButton />
            </SuggestPrice>

            <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            <AutoAcceptRiderSwitch />
            <ConfirmDeliveryButton onClick={handleSubmit} />
          </>
        )}
      </DetailsLayout>
    </DynamicOverlay>
  );
}

// Reusable components (unchanged from your original)
const DetailRow = ({ label, value, status }: { label: string; value: string; status?: string }) => (
  <div className="flex items-center justify-between">
    <p className="text-gray-400">{label}</p>
    <p className={`font-semibold ${status === "success" ? "text-green-400" : ""}`}>{value}</p>
  </div>
);

const ActionButton = ({ label }: { label: string }) => (
  <button className="flex items-center justify-between text-primary">
    <div className="flex items-center gap-2">
      <Image src={Stars} alt="stars" />
      <p>{label}</p>
    </div>
    <Plus />
  </button>
);

const PriceSuggestionButton = () => (
  <button className="flex w-full px-3 py-4 gap-2 rounded-md bg-orange-tint/[7%] justify-between">
    <div className="rounded-full h-fit p-3 bg-orange-tint/5">
      <Image src={MoneyIcon} alt="fare" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-4">
        <p className="font-semibold">NGN{"25,000"}</p>
        <span className="font-semibold flex bg-background items-center rounded-full text-xs text-gray-400 border-gray-400 border pr-2">
          <Dot />
          Standard
        </span>
      </div>
      <p className="text-foreground/60 text-left">Tap to suggest a new fare</p>
    </div>
    <Edit3 />
  </button>
);

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex items-center gap-3">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="online-payment" id="online-payment" />
      <Label htmlFor="online-payment">Online Payment</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="cash" id="cash" />
      <Label htmlFor="cash">Cash</Label>
    </div>
  </RadioGroup>
);

const AutoAcceptRiderSwitch = () => (
  <div className="rounded-md flex items-center bg-primary/10 p-4 rounded-l-md">
    <div className="flex-[2]">
      <p>Automatically accept nearest rider for NGN25,000</p>
    </div>
    <div className="flex-[1]">
      <div className="w-fit ml-auto h-fit">
        <Switch />
      </div>
    </div>
  </div>
);

const ConfirmDeliveryButton = ({ onClick }: { onClick: () => void }) => (
  <DialogTrigger asChild>
    <Button type="submit" onClick={onClick}>
      <Link href={"/passenger/home/"}>Confirm Delivery</Link>
    </Button>
  </DialogTrigger>
);
