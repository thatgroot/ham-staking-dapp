import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const DEFAULT_CHAIN_ID = sepolia.id;
export const MAIN_WALLET = "0xE36E96A3842039d68794C15ace30ab7C9143ad1A";
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
