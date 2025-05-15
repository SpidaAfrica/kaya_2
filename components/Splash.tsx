import { IconLogo } from "@/assets";
import Image from "next/image";
import React from "react";

export default function Splash() {
  return (
    <div className="w-full h-svh flex items-center justify-center bg-primary animate-fadeIn">
      <Image
        src={IconLogo}
        alt="icon-logo"
        width={150}
        height={150}
        className="object-contain"
        priority
      />
    </div>
  );
}
