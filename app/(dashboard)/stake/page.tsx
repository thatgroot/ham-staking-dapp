"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { Tether } from "iconsax-react";
import { useAccount, useBalance } from "wagmi";
import { DEFAULT_CHAIN_ID, MAIN_WALLET } from "@/config/wagmi";
import { UserService } from "@/services/user";

import { formatEther } from "viem";
import { notify } from "@/utils/notifications";
import { useSendBnb, useSendUSTD, useUSDTBalance } from "@/hooks/transactions";
import { APYS } from "@/config/apys";
import { calculateTotalAPYForAStake } from "@/lib/utils";

export default function Staking() {
  const { address } = useAccount();

  const { sendBnb, isConfirmed, isConfirming, isPending } = useSendBnb();

  const {
    isLoading: isConfirmingUSDTTransfer,
    isSuccess: isUSDTTransferConfirmed,
    sendUSTD,
  } = useSendUSTD();

  const [BNBBalance, setBNBBalance] = useState(0);

  const { usdtBalance } = useUSDTBalance(address as `0x${string}`);

  const { isFetched: fetchedBNBBalance, data: bnbData } = useBalance({
    address,
    chainId: DEFAULT_CHAIN_ID,
  });

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

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_LIMIT = stakeData.coin === "BNB" ? BNBBalance : usdtBalance;

    if (+e.target.value > MAX_LIMIT) {
      notify({
        content: `You can't stake more than ${MAX_LIMIT} ${stakeData.coin}`,
        type: "error",
      });
      return;
    }
    const value = +e.target.value;
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
      sendBnb(MAIN_WALLET, stakeData.amount);
    }

    function stakeUSDT() {
      if (!address || isPending) return;
      sendUSTD(MAIN_WALLET, stakeData.amount);
    }
    if (
      stakeData.amount >=
        (stakeData.coin === "BNB" ? BNBBalance : usdtBalance) ||
      stakeData.amount == 0
    ) {
      notify({
        content: "You can't stake more than your balance",
        type: "error",
      });
      return;
    }
    // if (stakeData.amount < 50 || stakeData.amount > 1000) {
    //   notify({
    //     content: "Staking amount limit is 50 USDT - 1000 USDT",
    //     type: "error",
    //   });
    //   return;
    // }
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
            coin: "BNB",
            wallet: address,
            amount: +stakeData.amount.toFixed(4),
            duration: stakeData.duration,
            stakedOn: Date.now(),
            maxApy: +calculateTotalAPYForAStake(
              stakeData.duration,
              stakeData.amount
            ).toFixed(4),
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
        await UserService.addStakeInfo({
          wallet: address,
          stakeData: {
            coin: "USDT",
            wallet: address,
            amount: +stakeData.amount.toFixed(4),
            duration: stakeData.duration,
            stakedOn: Date.now(),
            maxApy: +calculateTotalAPYForAStake(
              stakeData.duration,
              stakeData.amount
            ).toFixed(4),
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

  useEffect(() => {
    if (fetchedBNBBalance && bnbData) {
      setBNBBalance(+formatEther(bnbData.value ?? "0"));
    }
  }, []);

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
              max={stakeData.coin === "BNB" ? BNBBalance : usdtBalance}
              className="bg-transparent text-2xl font-medium md:w-[150px] w-[90px] focus:outline-none dark:text-white text-black"
            />
          </div>
          <div className="dark:text-gray-400 text-black flex flex-col items-end gap-2">
            {stakeData.coin === "BNB" ? (
              <span className="text-sm">~ {BNBBalance.toFixed(4)} BNB</span>
            ) : (
              <span className="text-sm">~ {usdtBalance.toFixed(4)} USDT</span>
            )}
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
              value: `${APYS[stakeData.duration]}% Daily`,
              highlight: true,
            },
            {
              label: "DURATION",
              value: stakeData.duration,
            },
            {
              label: "Total APY",
              value: `${calculateTotalAPYForAStake(
                stakeData.duration,
                stakeData.amount
              )}%`,
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
            {isConfirmingUSDTTransfer || isConfirming ? (
              <LoaderCircle className="h-6 w-6 animate-spin" />
            ) : (
              "Stake"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
