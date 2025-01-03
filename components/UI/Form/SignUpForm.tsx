"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ReferralService } from "@/services/referral";
import { useSignupForm } from "@/hooks/signup";
// import Button from "@/components/ui/Main/Button";{Butto}
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "../Button";

interface SignUpFormProps {
  wallet: string;
  referralCode?: string;
}

function SignUpForm({ wallet, referralCode }: SignUpFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { formData, handleChange } = useSignupForm(wallet, referralCode);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { by, ...formDataWithoutCode } = formData;

    if (!formDataWithoutCode.name || !formDataWithoutCode.wallet) {
      setError("Name and email are required");
      setLoading(false);
      return;
    }

    try {
      const exists = await ReferralService.checkUserExistence(formData.wallet);
      if (exists) {
        router.push("/dashboard");
        return;
      }

      await ReferralService.registerUser(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-fit bg-black">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={wallet}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              id="referralCode"
              name="by"
              type="text"
              placeholder="Enter referral code (optional)"
              defaultValue={referralCode ?? ""}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default SignUpForm;
