"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ReferralNode } from "@/components/UI/Referrals/ReferralNode";
import { ReferralService } from "@/services/referral";

export function ReferralsContent() {
  const [publicKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral>();
  const handleGetReferrals = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);

    const referralsList = await ReferralService.getReferrals(publicKey);
    setReferrals(referralsList);

    setLoading(false);
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      handleGetReferrals();
    }
  }, [publicKey, handleGetReferrals]);

  return (
    <div className="rounded-xl bg-white/10 p-6 backdrop-blur-lg">
      <h1 className="mb-6 text-2xl font-bold text-white krona">
        Your Referral Network
      </h1>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <LoaderCircle className="animate-spin h-6 w-6 text-white" />
            </div>
          ) : !referrals ? (
            <span className="text-white">Proceed Registration</span>
          ) : (
            <ReferralNode node={referrals} isRoot={true} />
          )}
        </div>
      </div>
    </div>
  );
}
