import { IconLogo } from "@/assets";
import Image from "next/image";
import React from "react";

export default function Splash() {
  return (
    <div className="w-full h-svh flex items-center justify-center bg-primary">
      <Image
        src={IconLogo}
        alt="icon-logo"
        width={150} // Adjust width as needed
        height={150}
        className="w-24 sm:w-36 md:w-40 lg:w-44 object-contain"
        priority
      />
    </div>
  );
}
