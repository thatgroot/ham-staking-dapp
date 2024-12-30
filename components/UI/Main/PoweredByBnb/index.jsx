import Image from "next/image";
import Icon from "@/public/main/bnb.svg";

const PoweredByBnb = () => {
  return (
    <div className="flex items-center max-w-[250px] gap-2 px-4">
      <Image src={Icon} className="w-9 lg:w-12 " />
      <h1 className="text-xs lg:text-sm font-semibold  flex-1">Powered by <br /> Binance Smart Chain</h1>
    </div>
  );
};
export default PoweredByBnb;
