"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Tether } from "iconsax-react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { UserService } from "@/services/user";

import { erc20Abi, parseEther } from "viem";
import { USDT } from "@/config/coins";
import { notify } from "@/utils/notifications";
const MIN_LIMIT = 0.01;
export default function Staking() {
  const {
    data: hash,
    isPending,
    sendTransaction,
    // status,
    // submittedAt,
  } = useSendTransaction();

  const { data: contractHash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      chainId: DEFAULT_CHAIN_ID,
      hash: hash,
    });

  const {
    isLoading: isConfirmingUSDTTransfer,
    isSuccess: isUSDTTransferConfirmed,
  } = useWaitForTransactionReceipt({
    chainId: DEFAULT_CHAIN_ID,
    hash: contractHash,
  });

  const { address } = useAccount();

  const [stakeData, setStakeData] = useState<{
    amount: number;
    duration: StakeDuration;
    coin: Coin;
  }>({
    amount: 50,
    duration: 200,
    coin: "USDT",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const durations = [200, 365, 500];
  const coins = ["USDT", "BNB"];

  // Map durations to their daily rates
  const durationRates = {
    200: 0.5,
    365: 0.6,
    500: 0.7,
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(MIN_LIMIT, Math.min(1000, Number(e.target.value)));
    setStakeData((prev) => ({ ...prev, amount: value }));
  };

  const handleDurationChange = (duration: StakeDuration) => {
    setStakeData((prev) => ({ ...prev, duration: duration }));
  };

  const handleCoinChange = (coin: Coin) => {
    setStakeData((prev) => ({ ...prev, coin: coin }));
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // const handleClickOutside = (e) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  //     setIsDropdownOpen(false);
  //   }
  // };

  // Calculate total APY based on daily rate and duration
  const calculateTotalAPY = () => {
    const dailyRate = durationRates[stakeData.duration];
    const days = stakeData.duration;
    return (dailyRate * days).toFixed(2);
  };

  // Calculate unlock date based on duration
  const calculateUnlockDate = () => {
    const days = stakeData.duration;
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + days);
    return unlockDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function stakeCoin() {
    function stakeBNB() {
      if (!address || isPending) return;
      sendTransaction({
        to: "0xE36E96A3842039d68794C15ace30ab7C9143ad1A",
        value: parseEther(stakeData.amount.toString()),
      });
    }

    function stakeUSDT() {
      if (!address || isPending) return;
      writeContract({
        address: USDT,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          "0xE36E96A3842039d68794C15ace30ab7C9143ad1A",
          parseEther(stakeData.amount.toString()),
        ],
      });
    }

    if (stakeData.coin === "USDT") {
      stakeUSDT();
    } else {
      stakeBNB();
    }
  }

  useEffect(() => {
    async function updateStakeInfo() {
      if (isConfirmed && address) {
        await UserService.addStakeInfo({
          wallet: address,
          stakeData: {
            name: "",
            coin: "BNB",
            wallet: address,
            amount: stakeData.amount,
            duration: stakeData.duration,
            stakedOn: Date.now().toString(),
          },
          value: stakeData.amount,
        });
        notify({
          content: "BNB staked successfully!",
          type: "success",
        });
      }
    }
    updateStakeInfo();
  }, [isConfirmed]);

  useEffect(() => {
    async function updateStakeInfo() {
      if (isUSDTTransferConfirmed && address) {
        console.log("isUSDTTransferConfirmed", isUSDTTransferConfirmed);
        await UserService.addStakeInfo({
          wallet: address,
          stakeData: {
            name: "",
            coin: "USDT",
            wallet: address,
            amount: stakeData.amount,
            duration: stakeData.duration,
            stakedOn: Date.now().toString(),
          },
          value: stakeData.amount,
        });
        notify({
          content: "USDT staked successfully!",
          type: "success",
        });
      }
    }
    updateStakeInfo();
  }, [isUSDTTransferConfirmed]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Amount Input Section */}
      <div className="md:p-8 p-4 rounded-2xl border dark:border-green-800 border-[#00C3FF] shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900">
        <h2 className="mb-4 text-lg font-semibold dark:text-white text-black">
          Enter Amount
        </h2>
        <div className="flex items-center justify-between md:px-4 px-2 py-6 rounded-xl border border-[#00C3FF] dark:border-[#2DE995] bg-white dark:bg-black/50 shadow-inner">
          <div className="flex items-center md:gap-4 gap-2">
            {/* Coin Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 md:px-4 px-1 py-3 bg-[#00C3FF] dark:bg-green-400 rounded-xl shadow-md transition-colors duration-200"
                onClick={toggleDropdown}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">
                    <Tether size={24} color="black" />
                  </span>
                </div>
                <span className="text-white font-semibold">
                  {stakeData.coin}
                </span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10"
                >
                  <ul className="py-1">
                    {coins.map((coin) => (
                      <li
                        key={coin}
                        className="hover:bg-[#00C3FF]/20 dark:hover:bg-[#2DE995]/20"
                      >
                        <button
                          className="block px-4 py-2 text-black dark:text-white"
                          onClick={() => handleCoinChange(coin as Coin)}
                        >
                          {coin}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <input
              type="number"
              value={stakeData.amount}
              onChange={handleAmountChange}
              className="bg-transparent text-2xl font-medium md:w-[150px] w-[90px] focus:outline-none dark:text-white text-black"
            />
          </div>
          <div className="dark:text-gray-400 text-black flex flex-col items-end gap-2">
            <span className="text-sm">Balance: 0</span>
            <span className="text-sm">~ 124.3 USD</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          * Staking amount limit is 50 USDT - 1000 USDT
        </p>

        {/* Durations */}
        <div className="max-w-lg mx-auto mt-6">
          <div className="text-sm text-white/50 mb-1">Duration</div>
          <div className="flex rounded-xl bg-[#00C3FF]/10 dark:bg-gray-900/50 border dark:border-[#2DE995] border-[#00C3FF] overflow-hidden">
            {durations.map((duration) => (
              <button
                key={duration}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200
                ${
                  stakeData.duration === duration
                    ? "bg-[#00C3FF] dark:bg-[#2DE995] text-white dark:text-black shadow-md"
                    : "text-[#036988] dark:text-[#2DE995] hover:bg-[#00C3FF]/20 dark:hover:bg-[#2DE995]/20"
                }`}
                onClick={() => handleDurationChange(duration as StakeDuration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="rounded-2xl border dark:border-green-800 border-[#00C3FF] overflow-hidden p-4 md:p-8 bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 md:mb-8 dark:text-white text-black">
          Overview
        </h2>

        <div className="flex items-center text-white dark:text-black shadow-lg justify-between px-3 py-2 md:py-4 md:px-6 dark:bg-[#2DE995] bg-[#00C3FF] rounded-xl mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 text-2xl bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              💰
            </div>
            <span className="font-semibold text-xl">Total</span>
          </div>
          <span className="font-bold text-xl">
            {stakeData.amount} {stakeData.coin}
          </span>
        </div>

        <div className="space-y-4 dark:bg-[#3746384D] border border-[#11C7FF] dark:border-green-500 bg-[#DBF7FF] p-4 md:p-6 rounded-2xl shadow-md">
          {[
            {
              label: "Daily Rate",
              value: `${durationRates[stakeData.duration]}% Daily`,
              highlight: true,
            },
            {
              label: "DURATION",
              value: stakeData.duration,
            },
            {
              label: "Total APY",
              value: `${calculateTotalAPY()}%`,
              highlight: true,
            },
            {
              label: "UNLOCK ON",
              value: calculateUnlockDate(),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-wrap justify-between items-center"
            >
              <span className="hover:underline cursor-pointer dark:text-[#BDEFC0] text-[#555555] transition-colors duration-200">
                {item.label}
              </span>
              <span
                className={`font-medium ${
                  item.highlight
                    ? "dark:text-green-400 text-[#11C7FF]"
                    : "dark:text-[#BDEFC0] text-black"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br mt-4 from-[#00ff88] to-[#ffbb00] p-px rounded-lg">
          <button
            onClick={() => {
              stakeCoin();
            }}
            className="px-6 w-full py-2 bg-[#11C7FF] text-black rounded-lg text-sm md:text-lg min-w-[150px] uppercase  font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50"
          >
            {isConfirmingUSDTTransfer || isConfirming
              ? "Confirming..."
              : "Stake"}
          </button>
        </div>
      </div>
    </div>
  );
}
