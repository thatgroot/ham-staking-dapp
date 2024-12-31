"use client";

import { ChangeEvent, useState } from "react";
import SalaryIcon from "@/public/assets/salary.png";
import { ArrowDownIcon as ArrowDown3 } from "lucide-react";
import Image from "next/image";

const Calculator = () => {
  // State to store input values
  const [stakingAmount, setStakingAmount] = useState(0);
  const [stakingDuration, setStakingDuration] = useState(200); // default to 200 days
  const [dailyRate, setDailyRate] = useState(0.5); // default to 0.5%

  // Mapping duration to daily rates
  const durationOptions: {
    [key: number]: {
      daily: number;
    };
  } = {
    200: { daily: 0.5 },
    365: { daily: 0.6 },
    500: { daily: 0.7 },
  };

  // Handle change for staking amount
  const handleStakingAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setStakingAmount(value);
    }
  };

  // Handle change for staking duration
  const handleStakingDurationChange = (duration: number) => {
    setStakingDuration(duration);
    setDailyRate(durationOptions[duration].daily);
  };

  // Calculate the estimated daily earnings
  const calculateDailyEarnings = () => {
    return stakingAmount * (dailyRate / 100);
  };

  // Custom Dropdown State
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("USDT");

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle selecting an option from the custom dropdown
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <div className="rounded-xl shadow-lg dark:border-none border border-[#11C7FF] dark:bg-gradient-to-b from-[#2DE96C] via-[#BEFF9E] to-[#F7FF5F] p-px">
      <div className="p-4 md:p-6 bg-white rounded-xl dark:bg-[#0B0B0B]">
        <h3 className="text-xl md:text-3xl font-semibold text-[#11C7FF] dark:text-green-400 mb-3 md:mb-6">
          Staking Calculator
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[#11C7FF] dark:text-[#2DE96C]">
          <div className="space-y-8">
            {/* Staking Amount Input */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-[#333333] dark:text-[#E0E0E0]">
                Staking Amount
              </label>
              <div className="flex flex-col md:flex-row w-full md:items-center gap-2 md:gap-4">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={stakingAmount}
                  onChange={handleStakingAmountChange}
                  className="flex-1 px-2 p-2 text-lg font-semibold text-[#333] dark:text-[#E0E0E0] bg-[#F5F7FF] dark:bg-[#303030] border border-[#11C7FF] dark:border-[#2DE96C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11C7FF] transition-all duration-300"
                />

                {/* Custom Dropdown for Currency Selection */}
                <div className="relative">
                  <div
                    className="cursor-pointer p-2 w-36 justify-between flex items-center bg-[#F5F7FF] dark:bg-[#303030] border border-[#11C7FF] dark:border-[#2DE96C] rounded-lg text-lg font-semibold text-[#333] dark:text-[#E0E0E0] focus:outline-none focus:ring focus:ring-[#11C7FF] transition-all duration-300"
                    onClick={toggleDropdown}
                  >
                    {selectedOption}
                    <ArrowDown3 className="ml-2 text-[#11C7FF] dark:text-[#2DE96C]" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute z-10 top-full left-0 w-full bg-white dark:bg-[#2E2E2E] border border-[#11C7FF] dark:border-[#2DE96C] rounded-lg mt-2 shadow-lg">
                      <div
                        className="p-2 cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A]"
                        onClick={() => handleSelectOption("BNB")}
                      >
                        BNB
                      </div>
                      <div
                        className="p-2 cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A] rounded-b-lg"
                        onClick={() => handleSelectOption("USDT")}
                      >
                        USDT
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Staking Duration Input */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-[#333333] dark:text-[#E0E0E0]">
                Staking Duration (Days)
              </label>
              <div className="grid grid-cols-3 gap-4 w-full">
                {Object.keys(durationOptions).map((duration) => (
                  <button
                    key={duration}
                    onClick={() =>
                      handleStakingDurationChange(Number(duration))
                    }
                    className={`p-2 text-sm md:text-lg font-semibold w-full rounded-lg transition-all duration-300 focus:outline-none ${
                      stakingDuration === Number(duration)
                        ? "bg-gradient-to-r from-[#11C7FF] to-[#5D96FF] dark:bg-gradient-to-r dark:from-[#2DE96C] dark:to-[#4CAF50] text-black"
                        : "bg-[#F5F7FF] dark:bg-[#303030] border dark:border-black/20 text-[#333] dark:text-[#E0E0E0]/80"
                    }`}
                  >
                    {duration} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estimated Earnings Display */}
          <div className="space-y-8 md:border-l border-dashed dark:border-[#2DE96C] border-[#AC39D4] md:pl-6 flex flex-col justify-center">
            {/* Daily Rate Display */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-[#333333] dark:text-[#E0E0E0]">
                Daily Income Rate
              </label>
              <div className="text-lg md:text-xl font-semibold text-[#11C7FF] dark:text-[#2DE96C]">
                {dailyRate}% Daily Income
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#F5F7FF] dark:bg-[#303030] shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#11C7FF] dark:bg-[#2DE96C] shadow-md">
                  <Image
                    src={SalaryIcon}
                    alt="Salary"
                    width={48}
                    height={48}
                    className="w-8 md:w-12"
                  />
                </div>
                <div className="text-sm md:text-lg text-[#333] dark:text-[#E0E0E0]">
                  <div>Estimated Daily Earnings</div>
                  <div className="text-xl md:text-2xl font-bold text-[#11C7FF] dark:text-[#2DE96C]">
                    {calculateDailyEarnings().toLocaleString()} {selectedOption}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
