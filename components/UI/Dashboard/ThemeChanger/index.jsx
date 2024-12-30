"use client"
import { Moon, Sun1 } from "iconsax-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => setIsAnimating(false), 600);
    }, 300); // Delay for the animation
  };

  if (!mounted) return null; // Prevents SSR issues

  return (
    <>
      <div className="bg-[#E9E9EE] md:bg-white/15 rounded-full p-[3.72px] shadow-inner md:w-auto w-fit">
        <button
          onClick={handleThemeChange}
          className="relative w-[60px] h-[30px] rounded-full flex items-center focus:outline-none  z-30"
          aria-label="Toggle theme"
        >
          <div
            className={`absolute left-0 top-0 h-full w-1/2 rounded-full z-10  bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
              theme === "dark" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <div
            className={`h-full w-full z-20 flex items-center justify-center transition-opacity duration-300 `}
          >
            <Sun1
              color={theme === "light" ? "#047AFF" : `ffffff80`} 
              size={16}
            />
          </div>
          <div
            className={`h-full w-full z-20 flex items-center justify-center transition-opacity duration-300`}
          >
            <Moon
              color={theme === "dark" ? "#047AFF" : `ffffff80`}
              size={16}
            />
          </div>
        </button>
      </div>

      {/* Ripple animation using Framer Motion */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 15, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div
              className={`w-32 h-32 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-black"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeToggler;
