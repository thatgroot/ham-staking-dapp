"use client";
import t1 from "@/public/main/partners/meta.webp";
import t2 from "@/public/main/partners/binance.png";
import t3 from "@/public/main/partners/benzinga.png";
import t4 from "@/public/main/partners/apeswap.webp";
import t5 from "@/public/main/partners/bybit.png";
import t6 from "@/public/main/partners/coinmarketcap.png";
import t7 from "@/public/main/partners/dexscrenner.png";
import t8 from "@/public/main/partners/gecko.png";
import t9 from "@/public/main/partners/pancake.png";
import t10 from "@/public/main/partners/vindax.png";
import t11 from "@/public/main/partners/yahoo.png";
import t12 from "@/public/main/partners/dexview.webp";
import t13 from "@/public/main/partners/alchemy.jpeg";
import t14 from "@/public/main/partners/moralis.webp";
import t15 from "@/public/main/partners/trustwallet.webp";
import bg from "@/public/main/bgPartners.png";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useRef } from "react";

const Partners = () => {
  const partners = [
    t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15
  ];

  return (
    <div className="bg-custom-radial">
      <div className="max-w-[1440px] mx-auto px-[24px] md:px-[100px] py-[50px] md:py-[100px]">
        <div className="overflow-hidden py-20 bg-gradient-to-b from-[#5AC0FF]/10 to-[#5AC0FF]/40 border drop-shadow-card border-[#C6E0FB] rounded-[32px]">
          <div className="text-center mb-10 px-6">
            <h2 className="text-lg lg:text-3xl font-bold">Audited and Certified for Your Trust</h2>
            <p className="text-sm lg:text-xl text-[#202020]/80 mt-4">
            Ham Protocol is audited and certified by leading blockchain security
              firms.
            </p>
          </div>

          {/* Row 1 - Swiper Carousel for Partner Logos */}
          <div className="mb-10 w-full mx-auto overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              slidesPerView="3"
              spaceBetween={20}
              freeMode={true}
              speed={3500}
              loop={true}
              autoplay={{ delay: 0, }}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="w-full swiper-wrapper"
            >
              {partners.map((src, index) => (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center w-full h-full"
                >
                  <Image
                    src={src}
                    width={150}
                    height={150}
                    alt={`Partner ${index + 1}`}
                    className="w-fit max-w-[75%]  h-16 mx-auto object-contain "
                    priority
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Partners;
