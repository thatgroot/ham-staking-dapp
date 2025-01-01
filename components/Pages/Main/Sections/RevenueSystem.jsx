import SwapIcon from "@/public/main/revenuesystem/swap.png";
import StakeIcon from "@/public/main/revenuesystem/staking.png";
import GamingIcon from "@/public/main/revenuesystem/game.png";
import SlotIcon from "@/public/main/revenuesystem/slot.png";
import PayIcon from "@/public/main/revenuesystem/pay.png";
import NftsIcon from "@/public/main/revenuesystem/nft.png";
import Image from "next/image";
import bg1 from "@/public/main/revenuesystem/s1.svg";
import bg2 from "@/public/main/revenuesystem/s2.svg";
import bg3 from "@/public/main/revenuesystem/s3.svg";
import bg5 from "@/public/main/revenuesystem/s36.svg";
import bg6 from "@/public/main/revenuesystem/s6.svg";

const revenueData = [
  {
    icon: SwapIcon,
    title: "HamSwap",
    description: "Transaction fees from token swaps fuel the treasury.",
    img: bg1,
  },
  {
    icon: StakeIcon,
    title: "Staking",
    description:
      "Small fees on staking/unstaking and partial yield redistribution.",
    img: bg2,
  },
  {
    icon: GamingIcon,
    title: "Ham Gaming",
    description: "Revenue from in-game purchases, entry fees, and tournaments.",
    img: bg3,
  },
  {
    icon: PayIcon,
    title: "Ham Pay",
    description: "Minimal fees for payments & merchant integrations.",
  },
  {
    icon: SlotIcon,
    title: "Ham Slot",
    description: "Platform retains a share of winnings and participation fees.",
    img: bg5,
  },
  {
    icon: NftsIcon,
    title: "Ham NFT",
    description: "Fees from minting, trades, and exclusive auctions.",
    img: bg6,
  },
];

const RevenueSystem = () => {
  return (
    <div className="bg-custom-radial">
      <div className="px-4 sm:px-6 md:px-12 lg:px-[100px] py-10 md:py-[100px] max-w-[1440px] mx-auto">
        <div className="text-center mb-10 md:mb-[80px] max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            How We Generate Value for You
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#202020]/80">
            Ham Protocol operates on a user-centric revenue-sharing model.
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-[#202020]/80">
            60% of NFT auction revenue goes directly to staking rewards. Fees
            from trades, land sales, and metaverse activities ensure a
            sustainable ecosystem. Continuous development ensures the platform
            evolves with cutting-edge technology.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {revenueData.map((item, index) => (
            <div
              key={index}
              className="text-center overflow-hidden relative z-30 bg-gradient-to-b from-[#5AC0FF]/10 to-[#5AC0FF]/40 border drop-shadow-card border-[#C6E0FB] rounded-2xl sm:rounded-[32px] flex flex-col items-center px-4 py-6 md:px-6 md:py-8"
            >
              {item.img && (
                <Image
                  src={item.img}
                  className="absolute -z-10 inset-0 object-cover w-full opacity-50"
                  width={500}
                  height={500}
                  alt=""
                />
              )}
              <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px] bg-[#EEF5FD] backdrop-blur-3xl rounded-full flex items-center justify-center">
                <Image src={item.icon} alt={`${item.title} icon`} />
              </div>
              <div className="flex-1 mt-4 md:mt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-[#202020]/80">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueSystem;
