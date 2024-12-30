import Dashboard from "@/public/assets/dashboard.svg";
import Staking from "@/public/assets/staking.svg";
import Swap from "@/public/assets/swap.svg";
import Withdraw from "@/public/assets/withdraw.svg";

export const menuItems = [
  {
    icon: Dashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  { icon: Staking, label: "Staking", href: "/stake" },
  { icon: Swap, label: "Swap", href: "/swap" },
  { icon: Withdraw, label: "Withdraw", href: "/withdraw" },
];
