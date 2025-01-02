"use client";
import { usePathname } from "next/navigation";
import Dashboard from "@/public/assets/dashboard.svg";
import Staking from "@/public/assets/staking.svg";
import Swap from "@/public/assets/swap.svg";
import Withdraw from "@/public/assets/withdraw.svg";
import User from "@/public/assets/admin.svg";

import Image from "next/image";
import ThemeToggler from "@/components/ui/Dashboard/ThemeChanger";
import { X } from "lucide-react";
import PoweredByBnb from "@/components/ui/Main/PoweredByBnb";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";

const Sidenav = ({ onClose, open }) => {
  const currentPath = usePathname();
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!address) return;
    // if (address === "0x8c462b0fb450b64603Fc6BFDe6455D4f8e258c3A") {
    if (address === "0xF69c12BCAb3cc3Bef5a5BF7eD990B26dA2871D55") {
      setIsAdmin(true);
    }
  }, [address]);
  const menuItems = [
    {
      icon: Dashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    { icon: Staking, label: "Staking", href: "/stake" },
    { icon: Swap, label: "Swap", href: "/swap" },
    { icon: Withdraw, label: "Withdraw", href: "/withdraw" },
  ];

  return (
    <div
      className={`h-screen w-fit lg:w-[275px] justify-between  flex-col shadow-lg overflow-auto dark:bg-[#0B0B0B] bg-[#fff] border-r dark:border-white/20 border-[#73737329] flex`}
    >
      <div className="">
        <div className="flex items-center justify-between h-[100px] text-center w-full p-4 md:p-6 ">
          <h1 className="text-transparent animate-gradient-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold w-fit md:mx-auto">
            $ Ham Protocol
          </h1>
          <button onClick={onClose} className="lg:hidden">
            <X color="black" className="w-6 h-6 text-gray-400 z-40" />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center">
                <button
                  className={`${
                    currentPath === item.href
                      ? "  text-[#00C3FF] dark:text-[#00C3FF] bg-[#00C3FF]/10  px-8 py-4"
                      : "px-6 py-4"
                  } relative w-full flex gap-4 items-center h-full   hover:bg-[#00C3FF]/10 transition-colors mx-auto`}
                >
                  {currentPath === item.href && (
                    <div className="absolute top-0  left-0 w-1 bg-[#00C3FF] dark:bg-[#6AEDE0] h-full rounded-r-sm"></div>
                  )}
                  <Image
                    src={item.icon}
                    alt={item.label}
                    className={`w-6   ${
                      currentPath === item.href
                        ? "opacity-100 dark:opacity-100 "
                        : "opacity-20 dark:opacity-50"
                    } ${
                      currentPath === item.href
                        ? "filter brightness-110" // Slightly brightens the icon for active state
                        : ""
                    } ${open ? "filter dark:invert" : "filter dark:invert"} ${
                      currentPath === item.href
                        ? "filter dark:invert brightness-110"
                        : ""
                    }`}
                  />
                  <span
                    className={`text-lg font-medium  text-black dark:text-white ${
                      currentPath === item.href ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </div>
            </Link>
          ))}
          {isAdmin && (
            <Link href={"/admin-overview"}>
              <div className="flex items-center">
                <button
                  className={`${
                    currentPath === "/admin-overview"
                      ? "  text-[#00C3FF] dark:text-[#00C3FF] bg-[#00C3FF]/10  px-8 py-4"
                      : "px-6 py-4"
                  } relative w-full flex gap-4 items-center h-full   hover:bg-[#00C3FF]/10 transition-colors mx-auto`}
                >
                  {currentPath === "/admin-overview" && (
                    <div className="absolute top-0  left-0 w-1 bg-[#00C3FF] dark:bg-[#6AEDE0] h-full rounded-r-sm"></div>
                  )}
                  <Image
                    src={User}
                    alt={"admin"}
                    className={`w-6   ${
                      currentPath === "/admin-overview"
                        ? "opacity-100 dark:opacity-100 "
                        : "opacity-20 dark:opacity-50"
                    } ${
                      currentPath === "/admin-overview"
                        ? "filter brightness-110" // Slightly brightens the icon for active state
                        : ""
                    } ${open ? "filter dark:invert" : "filter dark:invert"} ${
                      currentPath === "/admin-overview"
                        ? "filter dark:invert brightness-110"
                        : ""
                    }`}
                  />
                  <span
                    className={`text-lg font-medium  text-black dark:text-white ${
                      currentPath === "/admin-overview"
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    Admin Panel
                  </span>
                </button>
              </div>
            </Link>
          )}

          <div className="md:hidden flex items-center justify-center border-t pt-4 mt-4 ">
            <ThemeToggler />
          </div>
        </nav>
      </div>
      <div className=" pb-4 lg:pb-10">
        <PoweredByBnb />
      </div>
    </div>
  );
};

export default Sidenav;
