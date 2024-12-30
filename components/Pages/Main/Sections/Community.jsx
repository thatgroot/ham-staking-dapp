"use client";

import { useState } from "react";
import Image from "next/image";

const Community = () => {
  const testimonials = [
    {
      name: "Sophia Martinez",
      testimonial:
        "Staking Made Easy! I’ve been staking with Ham for a few months now, and it’s been a seamless experience. The rewards are consistent, and the platform is super easy to use. Highly recommend it to everyone!",
      image: "https://placebeard.it/250/250",
    },
    {
      name: "George Taylor",
      testimonial:
        "NFTs with Real Value! As a gamer, I love how Ham NFTs are not just collectibles but also usable in play-to-earn games. It’s fun and rewarding at the same time. Great job, Ham team!",
      image: "https://placebeard.it/250/251",
    },
    {
      name: "George Taylor",
      testimonial:
        "Safe and Reliable Staking! I was hesitant at first, but Ham proved to be a trustworthy platform. My funds are secure, and the earnings are better than I expected. A big thumbs up!",
      image: "https://placebeard.it/250/254",
    },
    {
      name: "James Davies",
      testimonial:
        "Exciting Rewards and Bonuses! The referral program is amazing! I invited a few friends and earned extra rewards while they got started with staking. Ham makes earning easy and fun!",
      image: "https://placebeard.it/250/255",
    },
    {
      name: "Emma Garcia",
      testimonial:
        "Perfect for Beginners! As someone new to crypto, Ham made it so simple for me to start staking. The support team is responsive, and the guides are easy to follow. I’m excited for what’s to come!",
      image: "https://placebeard.it/250/259",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-custom-radial">
      <div className="px-4 sm:px-6 md:px-[100px] py-[50px] md:py-[100px] max-w-[1440px] mx-auto">
        <div className="text-center mb-[50px] md:mb-[80px] max-w-3xl mx-auto">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            What Our Community Says
          </div>
          <div className="text-sm sm:text-base md:text-xl text-[#202020]/80">
            Read inspiring stories and experiences from our community of
            stakers, showcasing how Ham Protocol has helped them earn and grow
            their assets.
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center">
            {/* Carousel */}
            <div className="relative w-full max-w-[95%] sm:max-w-[600px] bg-gradient-to-b from-[#5AC0FF]/10 to-[#5AC0FF]/40 border drop-shadow-card border-[#C6E0FB] rounded-[16px] md:rounded-[32px] p-4 sm:p-6">
              <div className="mb-4">
                <img
                  className="rounded-[16px]"
                  width={80}
                  height={80}
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col w-full">
                  <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-start">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm sm:text-base text-[#202020]/80">
                    Gamer
                  </p>
                </div>
                <p className="text-sm sm:text-base md:text-lg mt-4">
                  {testimonials[currentIndex].testimonial}
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-between w-full items-center mt-6 sm:mt-8 gap-2 px-4 sm:px-6">
              <button
                onClick={prevSlide}
                className="bg-[#3E8DE3] text-white w-8 sm:w-9 h-8 sm:h-9 rounded-full shadow"
              >
                &lt;
              </button>
              <div className="flex items-center justify-center gap-1">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 h-2 ${
                      currentIndex === index
                        ? "w-6 sm:w-9 bg-[#3E8DE3]"
                        : "w-2 bg-[#C5DDF7]"
                    } rounded-full`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="bg-[#3E8DE3] text-white w-8 sm:w-9 h-8 sm:h-9 rounded-full shadow"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
