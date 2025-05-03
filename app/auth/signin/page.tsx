"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "@/components/svgs";
import AuthForm from "../AuthForm";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "phoneNumber") {
      setPhoneNumber(value.replace(/^0/, ""));
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://jbuit.org/api/login.php", {
        method: "POST",
        credentials: "include", // 👈 very important
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: `+234${phoneNumber}`,
          password
        })
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // ✅ Store in sessionStorage only on client
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("jwt_token", data.token); // Store JWT token
        const user = data.user || {};

        sessionStorage.setItem("userId", user.id || "");
        sessionStorage.setItem("email", user.email || "");
        sessionStorage.setItem("imageUrl", user.image_url || "");
        sessionStorage.setItem("fullName", user.fullName || "");
        sessionStorage.setItem("phoneNumber", user.phone || "");
      }

      // ✅ Redirect to home
      router.push("/passenger/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm showCarousel>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <span className="text-2xl md:text-3xl text-foreground font-semibold">
            Welcome Back! 🤩
          </span>
          <p className="text-sm md:text-base text-muted-foreground">
            Let&apos;s get you back to your parcels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <FormInput
            label="Phone Number"
            wrapperClassName={() => "mt-2"}
            onChange={handleChange}
            className="py-6"
            name="phoneNumber"
            placeholder="080 **** ****"
            leading={
              <div className="w-16 overflow-visible border-r pr-2">+234</div>
            }
          />

          <FormInput
            label="Password"
            wrapperClassName={() => "mt-2"}
            onChange={handleChange}
            className="py-6"
            leading={<Lock />}
            type="password"
            name="password"
          />

          <Button
            type="submit"
            className="w-full h-12 text-sm md:text-base font-semibold mt-6"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="flex items-center justify-center gap-2 mt-6">
            <p className="text-foreground/70 text-sm md:text-base">
              Forgot Password?
            </p>
            <Link href="reset">
              <p className="text-[#00ABFD] text-sm md:text-base">Reset It</p>
            </Link>
          </div>
        </form>

        <div className="flex flex-col gap-6 w-full mt-8">
          <p className="text-center text-foreground/70 font-semibold text-sm md:text-base">
            Don&apos;t have an account?{" "}
            <Link href="signup">
              <span className="text-[#00ABFD]">Register</span>
            </Link>
          </p>
        </div>
      </div>
    </AuthForm>
  );
}
