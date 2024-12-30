"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

// Data
const INITIAL_STATE = {
  selectedCoin: { id: 1, name: "BNB" },
  selectedEarning: { id: 1, name: "Staking" },
  amount: "",
  walletAddress: "",
  isValidWallet: false,
  isValidAmount: false
};

const coins = [
  { id: 1, name: "BNB" },
  { id: 2, name: "ETH" },
  { id: 3, name: "BTC" },
];

const earnings = [
  { id: 1, name: "Staking" },
  { id: 2, name: "Referral" },
];



// Dropdown Component
const Dropdown = ({ label, items, selectedItem, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <label className="dark:text-gray-400 text-black text-sm mb-2 block">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl flex items-center justify-between"
        >
          <span>{selectedItem.name}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 dark:text-gray-400 text-black" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-2 bg-white dark:bg-[#374638] border border-[#11C7FF] dark:border-green-500 rounded-xl shadow-lg"
            >
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#11C7FF]/10 dark:hover:bg-green-500/10 dark:text-white text-black"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Transaction History Component
const TransactionHistory = ({ transactions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="relative p-[1px] rounded-xl mt-6 shadow-lg bg-gradient-to-br from-[#11C7FF] to-[#00ff88] dark:from-[#00ff88] dark:to-[#11C7FF]"
  >
    <div className="dark:bg-black bg-white rounded-xl py-6 overflow-hidden">
      <h2 className="dark:text-[#00ff88] text-[#11C7FF] text-2xl font-semibold mb-8 sm:px-6 px-3">
        Withdrawal History
      </h2>
      <div className="min-w-full">
        <div className="grid grid-cols-4 dark:text-[#BDEFC0] text-[#11C7FF] font-medium sm:text-sm text-xs mb-4 sm:px-8 px-3">
          <div>Transaction ID</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="grid grid-cols-4 items-center border-b border-[#93939440] sm:px-8 px-3 py-4 hover:bg-[#11C7FF]/5 dark:hover:bg-[#00ff88]/5"
            >
              <div>{transaction.id}</div>
              <div>{transaction.date}</div>
              <div
                className={transaction.amount.startsWith("+")
                  ? "text-[#00ff88]"
                  : "text-red-500"}
              >
                {transaction.amount}
              </div>
              <div>
                <span
                  className={`py-1 px-3 rounded-full ${
                    transaction.status === "Successful"
                      ? "bg-[#31FF21D6] text-white"
                      : "bg-[#F5272BE5] text-white"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Main Withdraw Component
const Withdraw = () => {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [transactions, setTransactions] = useState([
    { id: "tx12345", date: "2023-10-26", amount: "+100 BNB", status: "Successful" },
    { id: "tx67890", date: "2023-10-25", amount: "-50 ETH", status: "Pending" },
    { id: "tx13579", date: "2023-10-24", amount: "+25 BTC", status: "Successful" },
  ]);

  // Form handlers
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);
    setFormState((prev) => ({
      ...prev,
      amount: value,
      isValidAmount: numericValue > 0 && !isNaN(numericValue),
    }));
  };

  const handleWalletChange = (e) => {
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      walletAddress: value,
      isValidWallet: value.length === 42 && value.startsWith("0x"),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.isValidAmount && formState.isValidWallet) {
      const newTransaction = {
        id: `tx${Math.floor(Math.random() * 100000)}`,
        date: new Date().toISOString().split("T")[0],
        amount: `${formState.amount} ${formState.selectedCoin.name}`,
        status: "Pending",
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      console.log("Withdrawal submitted:", newTransaction);

      // Reset form
      setFormState(INITIAL_STATE);
    }
  };
  return (
    <div className="max-w-[800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative p-[1px] shadow-lg rounded-xl bg-gradient-to-br from-[#11C7FF] to-[#00ff88] dark:from-[#00ff88] dark:to-[#11C7FF]"
      >
        <form onSubmit={handleSubmit} className="dark:bg-black bg-white rounded-xl p-6 space-y-6">
          <Dropdown
            label="Select Earnings"
            items={earnings}
            selectedItem={formState.selectedEarning}
            onSelect={(earning) => setFormState(prev => ({ ...prev, selectedEarning: earning }))}
          />
          <Dropdown
            label="Select Coin"
            items={coins}
            selectedItem={formState.selectedCoin}
            onSelect={(coin) => setFormState(prev => ({ ...prev, selectedCoin: coin }))}
          />
          <div>
            <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
              Enter Amount to Withdraw
            </label>
            <div className="relative">
              <input
                type="text"
                value={formState.amount}
                onChange={handleAmountChange}
                placeholder={`e.g., 234 ${formState.selectedCoin.name}`}
                className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
              />
              {formState.amount && !formState.isValidAmount && (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          <div>
            <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
              Enter Wallet Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={formState.walletAddress}
                onChange={handleWalletChange}
                placeholder="Wallet Address"
                className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
              />
              {formState.walletAddress && (
                formState.isValidWallet ? (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff88]" />
                ) : (
                  <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#00ff88] to-[#ffbb00] p-px rounded-lg">
            <button type="submit" className="px-6 w-full py-2 bg-[#11C7FF] text-black rounded-lg text-sm md:text-lg min-w-[150px] uppercase  font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50">
              Withdraw
            </button>
          </div>
        </form>
      </motion.div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default Withdraw;
