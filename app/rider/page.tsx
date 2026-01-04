"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import Splash from "@/components/Splash";

export default function Home() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      redirect("/rider/signing");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);
  return <Splash />;
}
