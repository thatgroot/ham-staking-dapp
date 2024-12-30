"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/UI/Main/Button";
import { MenuIcon, Wallet } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/UI/Main/Logo";
import { ConnectMetaMask } from "@/components/UI/Web3/ConnectMetaMask";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200 },
    },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed top-0 left-0 w-full  z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[100px] pt-4">
        <div className="flex items-center justify-between h-[80px] bg-black/5 rounded-[20px] px-5 lg:px-10">
          <div className="text-xl font-bold">
            <Logo />
          </div>

          <ul className="hidden lg:flex items-center gap-5">
            {["Home", "Nfts", "EcoSystem", "Top Stakers", "Partners"].map(
              (link, index) => (
                <li key={index}>
                  <Link href={`#${link.toLowerCase().replace(/\s+/g, "")}`}>
                    {link}
                  </Link>
                </li>
              )
            )}
          </ul>

          <ConnectMetaMask />

          <div className="flex items-center gap-5 relative">
            <MenuIcon
              size={25}
              className="lg:block  text-2xl cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <motion.ul
                    ref={dropdownRef}
                    className="absolute top-12 min-w-[200px] right-0 bg-white shadow-lg  p-4 rounded-lg space-y-2"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {["Ham Staking", "Ham Pay", "Ham Swap", "Ham NFTs"].map(
                      (item, index) => (
                        <li key={index}>
                          <Link
                            href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                            className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                          >
                            {item}
                          </Link>
                        </li>
                      )
                    )}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>

            <MenuIcon
              size={25}
              className="hidden lg:hidden text-2xl cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={sidebarRef}
              className="fixed  top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-lg z-40 p-6 lg:hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold">HAM</div>
                <MenuIcon
                  size={25}
                  className="text-2xl cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                />
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  "Home",
                  "About",
                  "EcoSystem",
                  "Top Staker",
                  "Partners",
                  "Ham Staking",
                  "Ham Pay",
                  "Ham Swap",
                  "Ham NFTs",
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg hover:text-gray-700"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
