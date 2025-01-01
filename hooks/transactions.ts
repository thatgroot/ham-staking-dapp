import { USDT } from "@/config/coins";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";
import { erc20Abi, formatEther, parseEther } from "viem";
import {
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export const useSendBnb = () => {
  const {
    data: hash,
    isPending,
    sendTransaction,
    // status,
    // submittedAt,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      chainId: DEFAULT_CHAIN_ID,
      hash: hash,
    });

  function sendBnb(to: `0x${string}`, amount: number) {
    sendTransaction({
      to,
      value: parseEther(amount.toString()),
    });
  }

  return { sendBnb, isPending, isConfirming, isConfirmed };
};
export const useSendUSTD = () => {
  const { data: contractHash, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    chainId: DEFAULT_CHAIN_ID,
    hash: contractHash,
  });

  function sendUSTD(to: `0x${string}`, amount: number) {
    writeContract({
      address: USDT,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, parseEther(amount.toString())],
    });
  }
  return { sendUSTD, isLoading, isSuccess };
};

export const useUSDTBalance = (address: string) => {
  const { isFetched: fetchedBalance, data } = useReadContract({
    abi: erc20Abi,
    address: USDT,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    account: address as `0x${string}`,
    chainId: DEFAULT_CHAIN_ID,
  });

  // Debugging logs
  console.log("Fetched balance:", fetchedBalance);
  console.log("Data:", data);

  return {
    fetchedBalance,
    usdtBalance: fetchedBalance && data ? +formatEther(data ?? "0") : 0,
  };
};
