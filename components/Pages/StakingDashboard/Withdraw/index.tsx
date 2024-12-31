"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/services/user";
import { useUserData } from "@/hooks/user";
import { VBox } from "@/components/ui/Directional/flex";

const coins = ["BNB", "USDT"];
const earnings = ["Staking APY", "Referral Earning"];

// Main Withdraw Component
const WithdrawScreen = () => {
  const { address } = useAccount();
  const [formData, setFormData] = useState<Withdraw>();
  const { data } = useUserData();
  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    } as Withdraw);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (formData)
      UserService.requestWithdraw({
        ...formData,
        requestedOn: Date.now(),
        status: "requested",
      } as Withdraw);
    // Reset form
    setFormData({} as Withdraw);
  };

  useEffect(() => {
    if (address) {
      setFormData({
        ...formData,
        toWallet: address,
        requestedBy: address,
      } as Withdraw);
    }
  }, [address]);

  return (
    <div className="max-w-[800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative p-[1px] shadow-lg rounded-xl bg-gradient-to-br from-[#11C7FF] to-[#00ff88] dark:from-[#00ff88] dark:to-[#11C7FF]"
      >
        <form
          onSubmit={handleSubmit}
          className="dark:bg-black bg-white rounded-xl p-6 space-y-6 flex flex-col"
        >
          <Select
            required
            onValueChange={(value) => {
              setFormData({
                ...formData,
                type: value,
              } as Withdraw);
            }}
          >
            <SelectTrigger className="w-full h-14 dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500">
              <SelectValue placeholder="Select Earnings" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-transparent">
                {earnings.map((earning, index) => (
                  <SelectItem
                    className="bg-transparent text-black"
                    key={index}
                    value={earning}
                  >
                    {earning}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            required
            onValueChange={(value) => {
              setFormData({
                ...formData,
                coin: value,
              } as Withdraw);
            }}
          >
            <SelectTrigger className="w-full h-14 dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500">
              <SelectValue placeholder="Select Earnings" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-transparent">
                {coins.map((coin, index) => (
                  <SelectItem
                    className="bg-transparent text-black"
                    key={index}
                    value={coin}
                  >
                    {coin}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div>
            <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
              Enter Amount to Withdraw
            </label>
            <VBox className="dark:text-gray-300 text-gray-700 text-xs font-medium mb-2 block">
              {formData?.type === "Referral Earning" ? (
                <>
                  <span>BNB Referrals Earning {data?.bnbReferralsEarning}</span>
                  <span>
                    USDT Referrals Earning {data?.usdtReferralsEarning}
                  </span>
                </>
              ) : (
                <>
                  <span>Staked BNB {data?.stakedBNB ?? 0}</span>
                  <span>Staked USDT {data?.stakedUSDT ?? 0}</span>
                </>
              )}
            </VBox>
            <div className="relative">
              <input
                required
                type="number"
                name="amount"
                onChange={updateFormData}
                placeholder={`e.g., 234`}
                className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
              />
              <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            </div>
          </div>
          <div>
            <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
              Enter Wallet Address
            </label>
            <div className="relative">
              <input
                required
                type="text"
                name="toWallet"
                defaultValue={address}
                onChange={updateFormData}
                placeholder="Wallet Address"
                className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
              />
              {address ? (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff88]" />
              ) : (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#00ff88] to-[#ffbb00] p-px rounded-lg">
            <p
              // type="submit"
              className="px-6 w-full text-center py-2 bg-[#11C7FF] text-black rounded-lg text-sm md:text-lg min-w-[150px] uppercase font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50"
            >
              Withdraw
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default WithdrawScreen;
