import React from "react";
import { AuthGuard } from "@/components/AuthGuard";

export default function BasePage() {
  return(
    <AuthGuard>
      <div></div>
    </AuthGuard>
  );
}
