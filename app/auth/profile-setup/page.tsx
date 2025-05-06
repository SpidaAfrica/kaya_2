"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthForm from "../AuthForm";
import FormInput from "@/components/FormInput";
import { LockIcon } from "@/lib/icons";

export default function ProfileSetup() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // Get phoneNumber from sessionStorage on mount (client-side only)
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phoneNumber");
    setPhoneNumber(storedPhone);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("https://spida.africa/kaya-api/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }
      if (data.message == "Profile setup successful.") {
        
      // Store to sessionStorage after successful signup
      sessionStorage.setItem("fullName", fullName);
      sessionStorage.setItem("email", email);

      router.push("/auth/success");
      router.push("/auth/login");
      }

    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthForm>
      <div className="w-full max-w-[400px] px-4 mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <h1 className="text-2xl md:text-[32px] font-bold text-[#111827]">Let’s Get Personal!</h1>
          <p className="text-[#333232] text-sm md:text-base">
            Tell us your name, so we can address you properly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <fieldset className="flex flex-col w-full gap-3">
            <label htmlFor="fullName" className="text-[#0A0D14] text-sm md:text-base font-medium">
              Full Name
            </label>
            <div className="border w-full border-[#D1D5DB] px-3 rounded-lg flex items-center">
              <User className="text-[#868C98] w-5 h-5" />
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-12 outline-none px-3 text-sm md:text-base"
                placeholder="Enter your full name"
              />
            </div>
          </fieldset>

          {/* Email Address */}
          <fieldset className="flex flex-col w-full gap-3">
            <label htmlFor="email" className="text-[#0A0D14] text-sm md:text-base font-medium">
              Email Address 
            </label>
            <div className="border w-full border-[#D1D5DB] px-3 rounded-lg flex items-center">
              <Mail className="text-[#868C98] w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 outline-none px-3 text-sm md:text-base"
                placeholder="Enter your email address"
              />
            </div>
          </fieldset>

          {/* Password */}
          <fieldset className="flex flex-col w-full gap-3">
            <label htmlFor="password" className="text-[#0A0D14] text-sm md:text-base font-medium">
              Password
            </label>
            <FormInput
              type="password"
              id="password"
              leading={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 outline-none text-sm md:text-base"
              placeholder="Create a password"
            />
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!phoneNumber || !fullName || !password}
            className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium mt-8 disabled:opacity-60"
          >
            Continue
          </button>

          {/* Log In */}
          <div className="text-center pt-4">
            <p className="text-[#111827] text-sm md:text-base">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-[#00ABFD] font-medium"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </AuthForm>
  );
}
