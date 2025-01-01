import nftBg from "@/public/main/nftBg.png";
import Image from "next/image";
import Nft1 from "@/public/main/Nfts/nft1.jpeg";
import Nft2 from "@/public/main/Nfts/nft2.jpeg";
import Nft3 from "@/public/main/Nfts/nft3.jpeg";
import Nft4 from "@/public/main/Nfts/nft4.jpeg";

const Mint = () => {
  const nfts = [
    { img: Nft1, title: "NFT Game", price: "$23,000" },
    { img: Nft2, title: "NFT Art", price: "$15,000" },
    { img: Nft3, title: "NFT Collectible", price: "$30,000" },
    { img: Nft4, title: "NFT Rare Item", price: "$18,000" },
  ];

  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${nftBg.src})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3E8DE3]/10"></div>

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 md:px-[100px] py-16 md:py-[100px]">
        {/* Heading Section */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">MINT OUR NFTS</h1>
          <p className="text-sm sm:text-base md:text-lg text-[#202020]/80">
            Each entry is complemented with a personalized badge or rank,
            motivating others with the tagline: "Your name could be here. Start
            staking now!"
          </p>
        </div>

        {/* NFT Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 py-8">
          {nfts.map((nft, index) => (
            <div
              key={index}
              className="rounded-[20px] bg-white p-3 shadow-lg transform transition hover:scale-105"
            >
              <Image
                src={nft.img}
                alt={nft.title}
                className="w-full rounded-[20px] object-cover"
                width={500}
                height={500}
                priority
              />
              <div className="py-3 space-y-1 text-center">
                <h2 className="font-bold text-lg md:text-xl">{nft.title}</h2>
                <p className="text-[#3E8DE3] text-base md:text-lg">{nft.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-10 text-sm sm:text-base">
          <button className="px-6 py-2 rounded-md bg-[#3E8DE3] text-white font-bold hover:bg-[#336fb4] transition">
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mint;
