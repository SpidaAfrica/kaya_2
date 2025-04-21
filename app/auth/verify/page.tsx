"use client";

import React from "react";
import Image from "next/image";
import AuthForm from "../AuthForm";

const OtpPage = () => {
  const [otp, setOtp] = React.useState<[string, string, string, string]>(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedNumber = sessionStorage.getItem("phoneNumber");
    setPhoneNumber(storedNumber);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp as [string, string, string, string]);

    if (value && index < 3) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
  };

  return (
    <AuthForm>
      <div className="flex flex-col items-center justify-center gap-4 mb-8">
        <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center">
          <Image src="/images/lock.png" alt="lock" width={40} height={40} />
        </div>
        <h2 className="text-2xl font-semibold text-center">OTP Verification</h2>
        <p className="text-gray-500 text-center text-sm">
          {phoneNumber ? `Enter the OTP sent to ${phoneNumber}` : "Loading phone number..."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              name={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={otp.some((digit) => digit === "")}
          className="w-full bg-black text-white py-3 rounded-md text-center text-sm font-semibold disabled:opacity-50"
        >
          Verify
        </button>
      </form>
    </AuthForm>
  );
};

export default OtpPage;
