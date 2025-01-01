import { Moneys } from "iconsax-react";
import { ChartScatter, ShoppingBasket } from "lucide-react";
import NftImg from "@/public/main/about/nft.png";
import IcolandImg from "@/public/main/about/iconland.png";
import CollectionImg from "@/public/main/about/collection.png";
import Image from "next/image";
const About = () => {
  return (
    <div className="px-6 sm:px-10 md:px-[100px] max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center py-16 md:py-[124px] gap-12">
        {/* Text Section */}
        <div className="flex-1">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            What is Staking with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">
              {" "}
              Ham Protocol?{" "}
            </span>
          </div>
          <div className="text-sm sm:text-base md:text-lg text-[#202020]/80 text-center md:text-left">
            Ham Protocol on Binance Smart Chain offers endless earning
            opportunities! Stake your tokens, trade and mint NFTs, participate
            in exclusive auctions, and earn exciting rewards. Maximize your
            holdings on a secure, fast, and cost-efficient blockchain while
            exploring the dynamic world of crypto and NFTs.
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-6 flex-1">
          {[
            {
              icon: <Moneys size={50} color="black" />,
              info: "Stake, Trade, Create & Earn: Unleash the Power of Ham NFTs!",
              bg: CollectionImg,
            },
            {
              icon: <ShoppingBasket size={50} />,
              info: "Stake with Ham Protocol: Earn Rewards Up to 50%!",
              bg: NftImg,
            },
            {
              icon: <ChartScatter size={50} />,
              info: "Enter the Ham Metaverse: Build Your Legacy on Mars, Moon, and Beyond!",
              bg: IcolandImg,
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`relative w-full z-30 max-w-[275px] md:max-w-[330px]  md:h-[300px] bg-gradient-to-b from-[#5AC0FF]/10 to-[#5AC0FF]/40 border drop-shadow-card border-[#C6E0FB] rounded-[32px] flex items-center justify-center  p-3 overflow-hidden mx-auto ${
                index === 1 && "md:mt-8"
              } ${index === 2 && "md:mt-16"}`}
            >
              <div className="flex flex-col gap-2  items-center justify-center text-center  size-full ">
                <div>
                  <Image
                    alt="Item Bg"
                    src={item.bg}
                    className="w-full object-contain"
                  />
                </div>
                {/* <div>{item.icon}</div> */}
                <div className="text-lg sm:text-base  ">{item.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
