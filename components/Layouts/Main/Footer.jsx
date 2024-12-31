import PoweredByBnb from "@/components/ui/Main/PoweredByBnb";
import { Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-[#E9F3FF]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-[100px] py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        {/* <div className="text-2xl font-bold">HAM</div> */}
        <div>
          <PoweredByBnb />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row items-center gap-5 mt-4 md:mt-0">
          <div className="cursor-pointer hover:text-blue-600">HOME</div>
          <div className="cursor-pointer hover:text-blue-600">ABOUT</div>
          <div className="cursor-pointer hover:text-blue-600">ROADMAP</div>
          <div className="cursor-pointer hover:text-blue-600">TEAM</div>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-xl cursor-pointer hover:text-blue-600">
            <Twitter />
          </a>
          <a href="#" className="text-xl cursor-pointer hover:text-blue-600">
            <Facebook />
          </a>
          <a href="#" className="text-xl cursor-pointer hover:text-blue-600">
            <Instagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
