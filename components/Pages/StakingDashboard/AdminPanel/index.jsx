"use client";

import { useState } from "react";
import { UserTable } from "./components/UserTable";
import { WithdrawalRequests } from "./components/WithdrawalRequests";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");

  const stats = [
    { title: "Total Users", value: "1,234" },
    { title: "Total Staked", value: "$5,678,901" },
    { title: "Total Referrals", value: "9,876" },
    { title: "Pending Withdrawals", value: "$123,456" },
  ];

  return (
    <div className="  space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-[#0B0B0B] rounded-xl p-4 shadow-lg border border-[#11C7FF] dark:border-[#2DE96C]"
          >
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </h2>
            <p className="text-2xl font-bold text-[#11C7FF] dark:text-[#2DE96C]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0B0B0B] rounded-xl shadow-lg border border-[#11C7FF] dark:border-[#2DE96C] overflow-hidden">
        <div className="flex border-b border-[#11C7FF] dark:border-[#2DE96C]">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "users"
                ? "bg-[#11C7FF] dark:bg-[#2DE96C] text-white dark:text-black"
                : "text-[#11C7FF] dark:text-[#2DE96C]"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === "withdrawals"
                ? "bg-[#11C7FF] dark:bg-[#2DE96C] text-white dark:text-black"
                : "text-[#11C7FF] dark:text-[#2DE96C]"
            }`}
            onClick={() => setActiveTab("withdrawals")}
          >
            Withdrawal Requests
          </button>
        </div>
        <div className="p-4">
          {activeTab === "users" ? <UserTable /> : <WithdrawalRequests />}
        </div>
      </div>
    </div>
  );
}
