import { db } from "@/services/firebase";
import { ReferralService } from "@/services/referral";
import { UserService } from "@/services/user";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
const WITHDRAW_COLLECTION = collection(db, "withdraw_requests");

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use wallet hook to get the current connected wallet

  const [wallet] = useState({ wallet: "" });

  useEffect(() => {
    const fetchTokenBalance = async () => {
      // Only proceed if wallet is connected
      if (!wallet) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allUsers = await UserService.all();
        // Set the balance (converting to a readable number)
        setUsers(allUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token balance:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setUsers([]);
        setLoading(false);
      }
    };

    // Fetch balance when wallet is connected and mint address is provided
    if (wallet) {
      fetchTokenBalance();
    }
  }, [wallet]);

  return { users, loading, error };
};

export const useUserData = () => {
  const { address } = useAccount();

  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (wallet: string) => {
      try {
        setLoading(true);
        const ref = doc(collection(db, "users"), wallet);
        const existingSnapshot = await getDoc(ref);

        if (!existingSnapshot.exists()) {
          setError(`Document for wallet ${wallet} does not exist.`);
          setData(null);
        } else {
          setData(existingSnapshot.data() as UserData);
        }
      } catch (err) {
        console.error("err:", err);
        setError("Error fetching user data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchUserData(address);
    }
  }, [address]);

  return { data, loading, error };
};

export const useUserReferrals = () => {
  const { address } = useAccount();
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // ReferralService.getReferralCount()

  useEffect(() => {
    const fetchReferralCount = async () => {
      try {
        setLoading(true);
        const count = await ReferralService.getReferralCount(address as string);
        setCount(count);
      } catch (err) {
        console.error("Error fetching referral count:", err);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchReferralCount();
    }
  }, [address]);

  return { count, loading };
};

export const useUserWithdraw = (reload: boolean) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [data, setData] = useState<UserWithdraws>();

  useEffect(() => {
    setLoading(true);
    async function fetchUserWithdraws() {
      const withdrawDoc = doc(WITHDRAW_COLLECTION, address);
      const existingSnapshot = await getDoc(withdrawDoc);

      if (existingSnapshot.exists()) {
        const withdraws = existingSnapshot.data() as UserWithdraws;
        setData(withdraws);
        setLoading(false);
      } else {
        setError("No withdraws found");
        setLoading(false);
      }
    }
    fetchUserWithdraws();
  }, [address, reload]);

  return { data, loading, error };
};

export const useAllWithdrawRequests = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [data, setData] = useState<Withdraw[]>();

  useEffect(() => {
    async function fetchUserWithdraws() {
      setLoading(true);
      const existingSnapshot = await getDocs(WITHDRAW_COLLECTION);
      const tempRequestsData = existingSnapshot.docs.map((doc) => {
        return doc.data() as UserWithdraws;
      });

      if (tempRequestsData) {
        const tempWithdrawRequests: Withdraw[] = [];

        tempRequestsData.forEach((userWithdraws) => {
          Object.keys(userWithdraws)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .filter((key) => typeof userWithdraws[key] === "object")
            .forEach((key) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              const withdrawRequest: Withdraw = userWithdraws[key];
              tempWithdrawRequests.push(withdrawRequest);
            });
          setData(tempWithdrawRequests);
          setLoading(false);
        });
      } else {
        setError("No withdraws found");
        setLoading(false);
      }
    }
    fetchUserWithdraws();
  }, [address]);

  return { data, loading, error };
};
