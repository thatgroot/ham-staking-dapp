import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const DEFAULT_CHAIN_ID = sepolia.id;
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
