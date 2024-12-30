import { db } from "@/services/firebase";
import { UserService } from "@/services/user";
import { collection, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

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
