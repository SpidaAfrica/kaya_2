"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthForm from "../AuthForm";

type VerifyStep = "otp" | "success" | "error";

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = React.useState<VerifyStep>("otp");
  const [otp, setOtp] = React.useState<string[]>(["", "", "", ""]);
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedNumber = sessionStorage.getItem("phoneNumber");
    setPhoneNumber(storedNumber);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");

    // Call your backend to verify OTP
    try {
      const response = await fetch("https://api.kaya.ng/kaya-api/verify-otp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // On success, show the success screen
        setCurrentStep("success");
      } else {
        // On failure, show the error screen
        setCurrentStep("error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setCurrentStep("error");
    }
  };

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://kaya.ng/kaya-api/resend-phone-otp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage("OTP has been resent successfully!");
      } else {
        setMessage(result.message || "An error occurred, please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Failed to send OTP, please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "otp":
        return (
          <>
            <div className="flex flex-col items-center justify-center w-full">
              <Image
                src="/rider/otp.svg"
                alt="OTP Verification"
                width={89}
                height={88}
                className="mb-6"
              />
              <h3 className="text-[#111827] text-xl sm:text-2xl font-bold mb-2">
                Verify Number
              </h3>
              <p className="text-[#333232] text-center text-sm px-4 mb-8">
                To confirm your account, please enter the OTP we sent to{" "}
                <span className="font-semibold">{phoneNumber}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    type="number"
                    name={`otp-${index}`}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full text-[#0A0D14] aspect-square text-center text-xl sm:text-2xl font-semibold border border-[#D1D5DB] rounded-lg focus:border-[#00ABFD] focus:ring-1 focus:ring-[#00ABFD] outline-none"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otp.some((digit) => digit === "")}
                className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium disabled:cursor-not-allowed disabled:bg-opacity-60">
                Verify Account
              </button>

              <div className="text-center space-y-1">
                <p className="text-[#111827] text-sm">
                  Experiencing issues receiving the code
                </p>
                <button 
                  type="button"
                  className="text-[#0A0D14] leading-[20px] text-[16px] tracking-[-0.04em] underline font-medium"
                  onClick={handleResendOTP} disabled={loading}>
                  {loading ? "Sending..." : "Resend OTP"}
                </button>
                {message && <p>{message}</p>}
              </div>
            </form>
          </>
        );

      case "success":
        return (
          <div className="w-full gap-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <svg
                width="354"
                height="257"
                viewBox="0 0 354 257"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_531_13315)">
                  <path
                    opacity="0.4"
                    d="M147.7 5.77385C147.7 5.77385 171.171 -7.21731 188.361 5.77385C188.361 5.77385 207.222 0.325288 213.093 15.4308H144.365C144.365 15.4308 142.668 10.3838 147.7 5.77385Z"
                    fill="#CFDEF9"
                  />
                  <path
                    opacity="0.4"
                    d="M258.136 38.2529C258.136 38.2529 281.612 25.2617 298.797 38.2529C298.797 38.2529 317.663 32.8043 323.529 47.9098H254.771C254.771 47.9098 253.109 42.8628 258.136 38.2529Z"
                    fill="#CFDEF9"
                  />
                  <path
                    opacity="0.4"
                    d="M35.2909 73.4407C35.2909 73.4407 58.7624 60.4444 75.9518 73.4407C75.9518 73.4407 94.8184 67.987 100.684 83.0976H31.9363C31.9363 83.0976 30.2591 78.015 35.2909 73.4407Z"
                    fill="#CFDEF9"
                  />
                  <path
                    d="M178.492 254.197C235.593 254.197 281.883 207.907 281.883 150.806C281.883 93.7053 235.593 47.4158 178.492 47.4158C121.391 47.4158 75.1016 93.7053 75.1016 150.806C75.1016 207.907 121.391 254.197 178.492 254.197Z"
                    fill="white"
                  />
                  <mask
                    id="mask0_531_13315"
                    maskUnits="userSpaceOnUse"
                    x="75"
                    y="47"
                    width="208"
                    height="208">
                    <path
                      d="M179.082 254.197C236.183 254.197 282.472 207.907 282.472 150.806C282.472 93.7053 236.183 47.4158 179.082 47.4158C121.981 47.4158 75.6914 93.7053 75.6914 150.806C75.6914 207.907 121.981 254.197 179.082 254.197Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_531_13315)">
                    <path
                      opacity="0.4"
                      d="M295.778 63.8987H247.137C262.644 77.6624 254.161 107.386 241.749 121.419C228.092 136.849 222.156 161.19 234.634 193.841C247.111 226.492 222.166 223.518 181.21 237.765C140.255 252.011 128.971 229.455 91.5734 233.612C54.1755 237.77 60.112 196.809 44.6761 154.659C32.9861 122.705 10.3583 120.438 0.101582 121.21V250.065C0.0995729 250.856 0.253821 251.639 0.55547 252.371C0.857119 253.102 1.30023 253.767 1.85937 254.326C2.41851 254.886 3.08267 255.329 3.81372 255.632C4.54477 255.934 5.32832 256.089 6.1194 256.088H295.778C296.567 256.087 297.349 255.93 298.079 255.627C298.808 255.324 299.47 254.88 300.028 254.321C300.585 253.761 301.027 253.098 301.328 252.367C301.628 251.637 301.782 250.854 301.78 250.065V69.9012C301.78 68.3093 301.148 66.7825 300.022 65.6568C298.896 64.5311 297.37 63.8987 295.778 63.8987Z"
                      fill="#CFDEF9"
                    />
                  </g>
                  <mask
                    id="mask1_531_13315"
                    maskUnits="userSpaceOnUse"
                    x="73"
                    y="46"
                    width="208"
                    height="208">
                    <path
                      d="M177.332 253.45C234.433 253.45 280.722 207.16 280.722 150.059C280.722 92.958 234.433 46.6685 177.332 46.6685C120.231 46.6685 73.9414 92.958 73.9414 150.059C73.9414 207.16 120.231 253.45 177.332 253.45Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_531_13315)">
                    <path
                      d="M147.195 205.942C147.195 205.942 132.029 227.289 118.113 238.471L83.4492 202.857C90.4327 203.523 110.016 204.448 122.189 191.63C123.429 190.32 124.558 188.909 125.564 187.411C125.564 187.411 132.893 167.055 135.729 167.416C138.565 167.777 135.927 176.417 135.82 176.773C136.131 176.392 146.382 163.853 148.669 164.646C150.956 165.439 145.284 177.973 145.111 178.369C145.381 178.003 154.331 165.815 156.441 166.679C158.55 167.543 151.983 180.514 151.805 180.865C152.009 180.58 158.885 171.07 161.264 172.036C163.643 173.002 155.866 184.687 155.653 185.007C155.871 184.763 160.852 179.258 162.616 179.965C164.38 180.671 147.195 205.942 147.195 205.942Z"
                      fill="#703932"
                    />
                    <path
                      d="M203.324 210.639L212.036 207.045L239.228 106.918L230.516 110.511L203.324 210.639Z"
                      fill="#E3974B"
                    />
                    <path
                      d="M159.469 91.2531L168.18 87.6597L239.225 106.918L230.514 110.511L159.469 91.2531Z"
                      fill="#E9BE72"
                    />
                    <path
                      d="M230.53 110.503L159.539 91.2285L132.353 191.36L203.343 210.634L230.53 110.503Z"
                      fill="#E9B14D"
                    />
                    <g>
                      <path
                        d="M143.414 144.844L216.156 164.295"
                        stroke="white"
                        stroke-width="13.7231"
                        stroke-miterlimit="10"
                      />
                    </g>
                    <path
                      d="M161.344 108.976L187.463 116.137"
                      stroke="white"
                      stroke-width="13.7231"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M195.074 116.3L210.734 120.148"
                      stroke="#383138"
                      stroke-width="3.04957"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M193.91 121.129L209.57 124.971"
                      stroke="#383138"
                      stroke-width="3.04957"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M169.432 222.171C169.432 222.171 155.11 242.324 141.524 253.744H124.116C122.524 253.744 120.997 253.112 119.871 251.986C118.746 250.86 118.113 249.334 118.113 247.742L104.898 225.312C114.728 224.905 124.297 222.028 132.721 216.946C138.489 213.428 143.598 208.928 147.816 203.65C147.816 203.65 155.15 183.32 157.981 183.655C160.812 183.99 158.185 192.661 158.078 193.017C158.388 192.636 168.639 180.097 170.922 180.89C173.204 181.683 167.542 194.217 167.364 194.613C167.633 194.247 176.584 182.054 178.693 182.923C180.802 183.792 174.235 196.753 174.058 197.104C174.261 196.819 181.138 187.309 183.511 188.275C185.885 189.241 178.103 200.91 177.91 201.231C178.129 200.987 183.11 195.487 184.873 196.194C186.637 196.9 169.432 222.171 169.432 222.171Z"
                      fill="#7D4038"
                    />
                    <path
                      d="M170.438 215.64C170.438 215.64 173.868 214.954 175.927 212.209"
                      stroke="black"
                      stroke-width="0.508261"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M145.219 97.5505H159.089"
                      stroke="black"
                      stroke-width="0.508261"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M138.98 105.794H152.856"
                      stroke="black"
                      stroke-width="0.508261"
                      stroke-miterlimit="10"
                    />
                    <path
                      d="M147.43 101.367H161.305"
                      stroke="black"
                      stroke-width="0.508261"
                      stroke-miterlimit="10"
                    />
                  </g>
                  <path
                    d="M256.106 67.9037C256.133 67.2268 255.956 66.5572 255.597 65.9825C255.36 65.606 255.051 65.2796 254.688 65.0219C255.016 64.9494 255.334 64.835 255.633 64.6813C256.081 64.4491 256.482 64.1334 256.812 63.7512C256.946 64.145 257.149 64.5116 257.412 64.8338C257.659 65.1344 257.952 65.3935 258.281 65.6013C257.843 65.7364 257.44 65.9634 257.097 66.2671C256.613 66.7033 256.268 67.2726 256.106 67.9037Z"
                    stroke="white"
                    stroke-width="0.533674"
                    stroke-miterlimit="10"
                  />
                  <path
                    d="M66.2451 101.769C65.5706 101.793 64.9182 102.016 64.3696 102.41C64.0101 102.673 63.7075 103.007 63.4802 103.391C63.3784 103.07 63.2385 102.763 63.0634 102.476C62.7964 102.046 62.4517 101.671 62.0469 101.368C62.7917 101.051 63.4028 100.485 63.775 99.7666C63.9445 100.192 64.2026 100.577 64.5323 100.895C65.0035 101.35 65.5999 101.655 66.2451 101.769Z"
                    stroke="white"
                    stroke-width="0.533674"
                    stroke-miterlimit="10"
                  />
                  <path
                    d="M116.698 108C116.758 106.522 116.378 105.059 115.606 103.797C115.089 102.968 114.412 102.251 113.613 101.688C115.422 101.274 117.052 100.297 118.269 98.8975C118.56 99.7624 119.004 100.568 119.58 101.276C120.116 101.938 120.76 102.503 121.486 102.948C120.53 103.25 119.647 103.749 118.894 104.412C117.826 105.367 117.063 106.615 116.698 108Z"
                    fill="white"
                    stroke="#CFDEF9"
                    stroke-width="1.17408"
                    stroke-miterlimit="10"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_531_13315">
                    <rect
                      width="353.821"
                      height="256.087"
                      fill="white"
                      transform="translate(0.0898438)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span className="text-2xl md:max-w-[406px] md:text-[32px] font-bold">
                You’re In! 🎉
              </span>
              <p className="text-[#333232] text-sm md:text-base text-center max-w-[391px]">
                You’ve successfully signed up. Open the app, Set up, accept
                orders, and start delivering with ease!
              </p>
            </div>

            <button
              onClick={() => router.push("profile-setup")}
              className="w-full bg-[#00ABFD] text-white py-3 rounded-lg text-base font-medium">
              Start Sending
            </button>
          </div>
        );
  case "error":
  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4">
      <Image
        src="/rider/error.svg"
        alt="Error"
        width={120}
        height={120}
        className="mb-6"
      />
      <h3 className="text-red-600 text-xl sm:text-2xl font-bold mb-2">
        Verification Failed
      </h3>
      <p className="text-[#333232] text-sm mb-4">
        The OTP you entered is incorrect or has expired. Please try again.
      </p>
      <button
        onClick={() => setCurrentStep("otp")}
        className="bg-[#00ABFD] text-white px-6 py-3 rounded-lg font-medium"
      >
        Try Again
      </button>
    </div>
  );
    }
  };

  return (
    <AuthForm>
      <div className="w-full max-w-[400px] px-4 mx-auto flex flex-col items-center justify-center">
        {renderStep()}
      </div>
    </AuthForm>
  );
}


{/*"use client";

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

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");

    // Call your backend to verify OTP
    try {
      const response = await fetch("https://jbuit.org/api/verify-otp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // On success, show the success screen
        setCurrentStep("success");
      } else {
        // On failure, show the error screen
        setCurrentStep("error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setCurrentStep("error");
    }
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
*/}
