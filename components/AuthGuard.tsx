// components/AuthGuard.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;

  useEffect(() => {
    // If no token, redirect to login page
    if (!token) {
      router.push("/auth/signin");
    }
  }, [token, router]);

  if (!token) {
    // You can show a loading indicator here if you want
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};
