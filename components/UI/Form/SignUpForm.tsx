"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { VBox } from "@/components/UI/Directional/flex";
import { ReferralService } from "@/services/referral";
import { useSignupForm } from "@/hooks/signup";

interface SignUpFormProps {
  wallet: string;
  referralCode?: string;
}

export function SignUpForm({ wallet, referralCode }: SignUpFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { formData, handleChange } = useSignupForm(wallet, referralCode);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { by, ...formDataWithoutCode } = formData;

    if (!formDataWithoutCode.name) {
      //   notify({
      //     content: "Name is required",
      //     type: "error",
      //   });
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
      // @ts-expect-error['']
      console.error("Error registering user:", error.message);
      //   notify({
      //     content: "Registration failed. Please try again.",
      //     type: "error",
      //   });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VBox>
      <div className="max-w-lg mx-auto bg-white/5 p-6 rounded-lg shadow-md mb-6">
        <VBox gap={24}>
          <div className="bg-white/10 text-white px-4 py-2 rounded-full w-full">
            {wallet}
          </div>
          <input
            className="bg-white/10 text-black px-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#85CD4F]"
            required
            name="name"
            type="text"
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            className="bg-white/10 text-black px-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#85CD4F]"
            required
            name="by"
            type="text"
            onChange={handleChange}
            placeholder="Referral Code"
            defaultValue={referralCode ?? ""}
          />
          <button
            onClick={handleSubmit}
            className="bg-[#85CD4F] text-center px-6 py-2 hover:bg-[#6ba33f] text-white rounded-full font-semibold transition duration-300"
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
            ) : (
              <span>ProceedSignUp</span>
            )}
          </button>
        </VBox>
      </div>
    </VBox>
  );
}
