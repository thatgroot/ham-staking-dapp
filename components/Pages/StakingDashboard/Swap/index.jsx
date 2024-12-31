"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import PoweredByBnb from "@/components/ui/Main/PoweredByBnb";

import HAM from "@/public/assets/ham-logo.png";

import BNB from "@/public/assets/swap/bnb.png";
import USDT from "@/public/assets/swap/usdt.png";

export const coins = [
  { symbol: "BNB", label: "Binance Coin", logo: BNB },
  { symbol: "USDT", label: "Tether", logo: USDT },
];

export function CurrencyBox({
  symbol,
  amount,
  usdValue,
  onAmountChange,
  isFocused,
  setIsFocused,
  onCoinSelect,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const logoSrc = coins.find((coin) => coin.symbol === symbol)?.logo;

  return (
    <div
      className={`dark:bg-black/20 border border-[#00C3FF] dark:border-[#2DE995] backdrop-blur-sm rounded-2xl sm:p-4 p-2 transition-all duration-300 ease-in-out ${
        isFocused ? "shadow-lg" : "shadow-none"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="sm:w-[60px] sm:h-[60px] w-[30px] h-[30px] relative">
            <Image
              src={logoSrc}
              alt={symbol}
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 sm:text-[22px] text-lg dark:text-[#E3FFE5] text-[#036988] font-semibold"
              onClick={toggleDropdown}
            >
              {symbol}
              <ChevronDown className="w-4 h-4 dark:text-green-400 text-[#036988]" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 min-w-36 top-full left-0 w-full bg-white dark:bg-[#2E2E2E] border border-[#00C3FF] dark:border-[#2DE995] rounded-lg mt-2 shadow-lg">
                {coins.map((coin) => (
                  <div
                    key={coin.symbol}
                    className="p-2 cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#3A3A3A]"
                    onClick={() => {
                      onCoinSelect(coin.symbol);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {coin.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <input
          type="text"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent text-right text-2xl font-medium dark:text-[#2DE995] text-[#036988] outline-none w-32 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-[#00C3FF] dark:focus:ring-[#2DE995] rounded-md"
          placeholder="0"
        />
      </div>
      <div className="mt-2 text-right text-sm dark:text-[#DAFFDD] text-[#036988]">
        ~{usdValue} USD
      </div>
    </div>
  );
}

export default function SwapCard() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BNB");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }, [fromCurrency, toCurrency, fromAmount, toAmount]);

  const handleFromCoinSelect = useCallback((coin) => setFromCurrency(coin), []);
  const handleToCoinSelect = useCallback((coin) => setToCurrency(coin), []);

  const calculateUsdValue = useCallback((amount, currency) => {
    const rate = currency === "BNB" ? 300 : 1;
    return (parseFloat(amount) * rate).toFixed(4);
  }, []);

  return (
    <div className="min-h-[calc(100vh-100px)] lg:min-h-[calc(100vh-150px)] flex flex-col justify-center sm:px-4 px-1 relative overflow-hidden">
      <div className="absolute bottom-0 left-0">
        <PoweredByBnb />
      </div>

      {/* Floating coins background */}
      <div className="floating-coins">
        <div
          className="coin absolute"
          style={{
            top: `10%`,
            right: `10%`,
            animationDelay: `${1 * 0.5}s`,
          }}
        >
          <Image src={USDT} alt={"usdt"} width={50} height={50} />
        </div>
        <div
          className="coin absolute"
          style={{
            top: `10%`,
            left: `10%`,
            animationDelay: `${1 * 0.5}s`,
          }}
        >
          <Image src={BNB} alt={"usdt"} width={50} height={50} />
        </div>

        <div
          className="coin absolute bottom-24 left-20 opacity-80 animate-spin duration-[20000]"
          style={{ animationDelay: "2s" }}
        >
          <Image src={HAM} alt="HAM" width={50} height={50} />
        </div>
        <div
          className="coin absolute bottom-24 right-20 opacity-80 animate-spin duration-[20000]"
          style={{ animationDelay: "2s" }}
        >
          <Image src={BNB} alt="HAM" width={50} height={50} />
        </div>
      </div>

      <div className="relative p-[1px] rounded-3xl md:w-[660px] sm:w-[500px] w-full max-w-[95%] shadow-lg mx-auto overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF] to-[#2DE995] opacity-50" />
        <div className="dark:bg-black bg-[#fff] rounded-3xl p-6 space-y-4 relative z-10">
          <CurrencyBox
            symbol={fromCurrency}
            amount={fromAmount}
            usdValue={calculateUsdValue(fromAmount, fromCurrency)}
            onAmountChange={setFromAmount}
            isFocused={isFromFocused}
            setIsFocused={setIsFromFocused}
            onCoinSelect={handleFromCoinSelect}
          />

          <div className="relative py-2">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                onClick={swapCurrencies}
                className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#ffbb00] flex items-center justify-center rounded-full shadow-md"
              >
                <div className="rounded-full bg-[#00C3FF] dark:bg-[#1c1c1c] text-white flex items-center justify-center w-9 h-9 transition-all duration-300 ease-in-out">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5L12 19M12 19L19 12M12 19L5 12"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <CurrencyBox
            symbol={toCurrency}
            amount={toAmount}
            usdValue={calculateUsdValue(toAmount, toCurrency)}
            onAmountChange={setToAmount}
            isFocused={isToFocused}
            setIsFocused={setIsToFocused}
            onCoinSelect={handleToCoinSelect}
          />

          <div className="bg-gradient-to-br from-[#00ff88] to-[#ffbb00] p-px rounded-lg">
            <button className="px-6 py-2 bg-[#11C7FF] text-black rounded-lg text-sm md:text-lg min-w-[150px] uppercase font-semibold transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50 w-full">
              Swap
            </button>
          </div>

          <div className="flex justify-between sm:text-sm text-xs text-black dark:text-[#DAFFDD] px-1">
            <div>1 BNB = 300 USDT</div>
            <div>Fee = 0.300044 BNB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
