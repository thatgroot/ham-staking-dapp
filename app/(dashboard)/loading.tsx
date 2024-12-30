"use client";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="relative flex justify-center items-center min-h-[calc(100vh-100px)] ">
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="w-16 h-16 border-4 border-t-[#4A90E2] border-gray-300 rounded-full animate-spin"></div>
      </motion.div>
      <motion.div
        className="absolute top-24 text-lg text-gray-500"
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default Loading;
