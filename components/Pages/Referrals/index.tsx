"use client";

import { useCallback, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ReferralService } from "@/services/referral";
import { useAccount } from "wagmi";

export function ReferralsPage() {
  return <ReferralsClient />;
}
function ReferralsClient() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState<Referral>();

  const fetchReferrals = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);
      const data = await ReferralService.getReferrals(address);
      if (data) {
        setReferrals(data);
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchReferrals();
    }
  }, [address]);

  return (
    <Card className="backdrop-blur-lg bg-white/10">
      <CardHeader>
        <h1 className="text-2xl font-bold">Your Referral Network</h1>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            ) : !referrals ? (
              <span>Proceed Registration</span>
            ) : (
              <ReferralNode node={referrals} isRoot={true} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ReferralNodeProps {
  node: Referral; // Replace 'any' with your actual Referral type
  isRoot?: boolean;
}

export function ReferralNode({ node, isRoot = false }: ReferralNodeProps) {
  return (
    <Card
      className={`${
        isRoot ? "bg-primary/10" : "bg-background/50"
      } p-4 rounded-lg`}
    >
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium">
              {node.data.name || "Anonymous"} - Level {node.level}
            </h3>
            <p className="text-sm text-muted-foreground">{node.data.wallet}</p>
          </div>
        </div>

        {node.children?.length > 0 && (
          <div className="mt-4 space-y-4 pl-6 border-l-2 border-border">
            {node.children.map((child: Referral, index: number) => (
              <ReferralNode key={child.data.wallet || index} node={child} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
