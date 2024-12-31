import Button from "@/components/ui/Main/Button";
import heroBg from "@/public/main/heroBg.png";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="h-[90vh] flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroBg.src})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
      <div className="max-w-2xl px-4 sm:px-6 md:px-8 text-center space-y-5 relative z-10">
        {/* Gradient Text with Animation */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl fontRubik font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">
          Welcome to Ham Protocol
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#303030]/80">
          Maximize your crypto earnings with up to 15% APY. Stake, hold, and
          grow your assets.
        </p>
        <div className="w-fit mx-auto">
          <Link href={"/dashboard"}>
            <Button>Stake Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
