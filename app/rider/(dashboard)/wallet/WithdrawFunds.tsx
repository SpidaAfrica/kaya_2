"use client";

import { Button } from "@/components/ui/button";
import { LockIcon, User } from "lucide-react";
import SuccessModal from "@/components/Overlays/SuccessModal";
import FormInput from "@/components/FormInput";

export default function WithdrawFunds({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex mx-auto lg:w-[558px] w-[90%] flex-col gap-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Withdraw Funds</h2>
        <p className="text-foreground/60">
          Successfully withdraw your funds. You’ve Earned it!!
        </p>
      </header>

      <FormInput
        leading={
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.00111 7.50012C8.38179 7.50012 9.50111 6.38081 9.50111 5.00012C9.50111 3.61941 8.38179 2.50012 7.00111 2.50012C5.62037 2.50012 4.50109 3.61941 4.50109 5.00012C4.50109 6.38081 5.62037 7.50012 7.00111 7.50012ZM12.6289 0.00195312H1.37891C1.03373 0.00195312 0.753906 0.281772 0.753906 0.626953V9.37693C0.753906 9.72212 1.03373 10.0019 1.37891 10.0019H12.6289C12.9741 10.0019 13.2539 9.72212 13.2539 9.37693V0.626953C13.2539 0.281772 12.9741 0.00195312 12.6289 0.00195312ZM2.00391 7.27906V2.72119C2.70751 2.51075 3.26233 1.9557 3.47245 1.25195H10.5297C10.7404 1.95758 11.2976 2.51372 12.0039 2.72287V7.27737C11.2964 7.48687 10.7385 8.04456 10.5286 8.75193H3.47354C3.26426 8.0465 2.70874 7.48987 2.00391 7.27906Z"
              fill="#868C98"
            />
          </svg>
        }
        label="Amount To withdraw"
        placeholder="Enter amount to withdraw"
      />

      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#f2f2f2] w-fit">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 5.39961V10.7996C12 10.9587 11.9368 11.1114 11.8243 11.2239C11.7117 11.3364 11.5591 11.3996 11.4 11.3996H0.6C0.44087 11.3996 0.288258 11.3364 0.175736 11.2239C0.0632141 11.1114 0 10.9587 0 10.7996V5.39961H12ZM12 2.99961H0V1.19961C0 1.04048 0.0632141 0.887867 0.175736 0.775345C0.288258 0.662823 0.44087 0.599609 0.6 0.599609H11.4C11.5591 0.599609 11.7117 0.662823 11.8243 0.775345C11.9368 0.887867 12 1.04048 12 1.19961V2.99961Z"
            fill="#475467"
          />
        </svg>
        <span>Current Balance: NGN {"50,000"}</span>
      </div>

      <FormInput
        leading={<User className="size-5" />}
        label="Destination"
        placeholder="Meji Austin Peters"
      />

      <FormInput
        leading={<LockIcon className="size-5" />}
        label="Wallet Pin"
        type="Password"
        placeholder="4-digit wallet pin"
      />

      <div className="flex md:flex-col items-center gap-3 mt-3">
        <SuccessModal
          title="Withdrawal Successful! 💸"
          message="Your withdrawal has been processed. Check your account shortly!"
          showButton={false}>
          <Button>Save and Continue</Button>
        </SuccessModal>
        <Button
          variant="outline"
          onClick={onClose}
          className="text-primary">
          Cancel
        </Button>
      </div>
    </div>
  );
}
