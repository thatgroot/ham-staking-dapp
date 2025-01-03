"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BinanceCoin } from "iconsax-react";
import ThemeToggler from "@/components/ui/Dashboard/ThemeChanger";
import { menuItems } from "./menu-items";
import { Menu, X } from "lucide-react";
import PoweredByBnb from "@/components/ui/Main/PoweredByBnb";
import ConnectMetaMask from "@/components/ui/Web3/ConnectMetaMask";

const menuVariants = {
  closed: {
    opacity: 0,
    display: "none",
    y: -10,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  open: {
    opacity: 1,
    display: "block",
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      display: { delay: 0.1 },
    },
  },
};

const Header = () => {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const formattedPath =
    currentPath === "/"
      ? "Home"
      : currentPath.replace("/", "").charAt(0).toUpperCase() +
        currentPath.slice(2);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavClick = (hash: string) => {
    if (pathname !== "/") {
      router.push(`/#${hash}`);
    } else {
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[100px] flex-col justify-center border-b border-gray-200 bg-white shadow-lg shadow-black/5 backdrop-blur-sm dark:border-white/20 dark:bg-[#0B0B0B]">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <h1 className="text-xl font-semibold text-[#00C3FF] dark:text-green-500 md:text-2xl">
          {formattedPath}
        </h1>

        <div className="flex items-center gap-6">
          <BnbPrice />
          <div className="hidden md:block">
            <ThemeToggler />
          </div>
          <ConnectMetaMask />
          <div className="relative md:hidden">
            <MobileMenuToggle isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
            <MobileMenu
              ref={menuRef}
              isOpen={isMenuOpen}
              menuItems={menuItems}
              handleNavClick={handleNavClick}
              pathname={currentPath}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const BnbPrice = () => (
  <div className="hidden items-center rounded-full bg-[#DBF7FF] shadow-lg dark:bg-[#DAFFDD] md:inline-flex">
    <div className="flex h-6 w-6 scale-150 items-center justify-center rounded-full bg-[#f3ba2f] shadow-md">
      <BinanceCoin size={24} color="#0B0B0B" />
    </div>
    <div className="px-6 pl-2 py-1 text-lg text-[#00C3FF] dark:text-[#1e1656]">
      <div className="leading-tight">$ 786</div>
    </div>
  </div>
);

const MobileMenuToggle = ({ isOpen, setIsOpen }) => (
  <div className="relative">
    <button
      className="text-black focus:outline-none md:hidden"
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <X size={28} className="text-black dark:text-white" />
      ) : (
        <Menu className="text-black dark:text-white" size={28} />
      )}
    </button>
  </div>
);

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: { href: string; label: string }[];
  handleNavClick: (hash: string) => void;
  pathname: string;
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, menuItems, handleNavClick, pathname }, ref) => (
    <motion.div
      ref={ref}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-md bg-white dark:bg-black shadow-lg md:hidden"
    >
      <nav className="p-4">
        <ul className="flex flex-col items-center gap-4 text-black dark:text-white ">
          {menuItems.map((item) => (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                className={`block rounded-md px-4 py-2 text-sm transition duration-300  ${
                  pathname === item.href
                    ? "bg-[#11C7FF] text-white dark:bg-[#2DE995] dark:text-black"
                    : "text-black dark:text-white dark:hover:bg-white/20 hover:bg-black/20"
                }`}
                onClick={() => handleNavClick(item.href.toLowerCase())}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <ThemeToggler />
          {/* Added PoweredByBnb component - needs to be defined */}
          <PoweredByBnb />
        </ul>
      </nav>
    </motion.div>
  )
);

MobileMenu.displayName = "MobileMenu";

export default Header;
