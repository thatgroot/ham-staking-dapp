import Image from "next/image"
import LogoImg from "@/public/main/hamcoin.png"

const Logo = () => {
  return (
    <div className="flex items-center gap-1">
        <Image src={LogoImg} width={100} className="w-12 animate-pulse " height={100}  />
        Ham Protocol
    </div>
  )
}
export default Logo