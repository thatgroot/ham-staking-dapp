"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown2 } from "iconsax-react";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState([2, 3]); // 3rd and 4th FAQs are open by default (indices 2 and 3)

  const faqs = [
    {
      question: "What is staking?",
      answer: "Staking is the process of locking your cryptocurrency or NFTs in a platform to earn rewards over time. It’s an easy way to grow your assets passively."
    },
    {
      question: "How much can I earn by staking?",
      answer: "Your earnings depend on the staking lock duration. The longer you lock your funds, the higher the earning, with a maximum earning for extended lock durations."
    },
    {
      question: "Are my funds safe?",
      answer: "Yes, your funds are completely safe. Our platform is secured with Binance Smart Blockchain technology and robust security protocols."
    },
    {
      question: "How much can I withdraw?",
      answer: "You can withdraw your monthly income at any time and the full staked amount once the lock duration is complete."
    },
    {
      question: "How can I stake NFTs?",
      answer: "Simply buy your desired NFT and stake it on the platform. The process is straightforward and designed to be user-friendly."
    },
    {
      question: "Is there any real value to NFTs?",
      answer: "Yes, our NFTs have real value. NFTs will be used in games to enhance characters in play-to-earn scenarios, adding both utility and earning potential."
    },
    {
      question: "Is there any referral bonus available?",
      answer: "Absolutely! You can refer friends and family to our platform and earn up to a 30% reward as a bonus."
    },
    {
      question: "How long will this project be in development?",
      answer: "This is a long-term project. Currently, Hamcoin, BNB, USDT staking, and NFTs are live. Upcoming features include Hampay, Ham gaming (play-to-earn), Ham slots, and the Ham metaverse. You can join us with peace of mind and watch the project grow."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex((prevOpenIndex) =>
      prevOpenIndex.includes(index)
        ? prevOpenIndex.filter((i) => i !== index) // Close the FAQ if it's open
        : [...prevOpenIndex, index] // Open the FAQ if it's closed
    );
  };

  return (
    <div>
      <div className="px-6 md:px-[100px] py-[100px] max-w-[1440px] mx-auto">
        <div className="text-center mb-[80px] max-w-3xl mx-auto">
          <div className="text-4xl text-center">
            Got Questions? We've Got Answers.
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`rounded-xl h-fit p-4 lg:p-6 ${
                  openIndex.includes(index) ? "bg-[#C5DDF7]/60" : "bg-[#C5DDF7]/30"
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div
                    className={`text-lg sm:text-xl md:text-xl ${
                      openIndex.includes(index) ? "text-[#3E8DE3]" : ""
                    }`}
                  >
                    {faq.question}
                  </div>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: openIndex.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2"
                  >
                    <ArrowDown2 color="black" size={20} />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: openIndex.includes(index) ? 1 : 0,
                    height: openIndex.includes(index) ? "auto" : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-[#202020]/80  text-sm lg:text-xl overflow-hidden"
                >
                  {openIndex.includes(index) && faq.answer}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
