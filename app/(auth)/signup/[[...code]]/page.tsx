"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReferralService } from "@/services/referral";
import VBox from "@/components/ui/Directional/VBox";
import ConnectMetaMask from "@/components/ui/Web3/ConnectMetaMask";
import { useAccount } from "wagmi";
import SignUpForm from "@/components/ui/Form/SignUpForm";

export default function RegistrationContent() {
  const { address } = useAccount();
  const router = useRouter();
  const params = useParams<{ code: string }>();

  useEffect(() => {
    if (!address) return;

    const checkExistence = async () => {
      const exists = await ReferralService.checkUserExistence(address);
      if (exists) {
        router.replace("/dashboard");
      }
    };

    checkExistence();
  }, [address, router]);

  const referralCode = Array.isArray(params.code)
    ? params.code[0]
    : params.code;

  return (
    <VBox
      alignItems="center"
      justifyContent="center"
      className="rounded-xl bg-white/10 backdrop-blur-lg bgballs w-screen h-screen"
    >
      {address ? (
        <SignUpForm wallet={address as string} referralCode={referralCode} />
      ) : (
        <ConnectMetaMask />
      )}
    </VBox>
  );
}
