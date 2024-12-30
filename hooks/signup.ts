"use client";

import { useState, ChangeEvent } from "react";

interface FormData {
  wallet: string;
  name: string;
  by: string;
}

export function useSignupForm(wallet: string, referralCode?: string) {
  const [formData, setFormData] = useState<FormData>({
    wallet,
    name: "",
    by: referralCode ?? "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    handleChange,
  };
}
