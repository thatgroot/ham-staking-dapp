"use client";
import SideNav from "@/components/Layouts/StakingDashboard/SideNav";
import Header from "@/components/Layouts/StakingDashboard/Header";
import { useAccount } from "wagmi";
import { UserService } from "@/services/user";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const account = useAccount();
  const [loading, setLoading] = useState(true);
  const [, setData] = useState<UserData>();

  useEffect(() => {
    async function loadUserData() {
      if (account.address) {
        setLoading(true);
        const _data = await UserService.data(account.address);
        if (!_data) {
          redirect("/signup");
        }
        setData(_data);
        setLoading(false);
      } else {
        redirect("/signup");
      }
    }
    if (account) {
      setLoading(true);
      loadUserData();
    }
  }, [account]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black dark:text-white text-black">
      <aside
        className={`fixed hidden lg:block lg:relative z-50 h-screen overflow-auto transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full}`}
      >
        <SideNav onClose={() => {}} open={false} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-white dark:bg-black/10 md:p-6 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
