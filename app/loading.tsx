import { IconLogo } from "@/assets";
import Image from "next/image";
import React from "react";

export default function Loading() {
  return (
    <div className="w-1/2 h-[50svh] flex items-center justify-center bg-primary">
      <Image src={IconLogo} alt="icon-logo" />
    </div>
  );
}
