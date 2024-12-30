import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
const usersCollection = collection(db, "users");

export const UserService = {
  data: async (wallet: string) => {
    const ref = doc(collection(db, "users"), wallet);
    const existingSnapshot = await getDoc(ref);

    if (!existingSnapshot.exists()) {
      return;
    }

    return existingSnapshot.data() as UserData;
  },
  all: async () => {
    const existingSnapshot = await getDocs(collection(db, "users"));
    const users = existingSnapshot.docs.map((doc) => {
      return doc.data() as UserData;
    });

    return users;
  },

  addStakeInfo: async ({
    wallet,
    stakeData,
    value,
  }: {
    wallet: `0x${string}`;
    stakeData: StakeInfo;
    value: number;
  }): Promise<boolean> => {
    const { stakedOn } = stakeData;

    const ref = doc(collection(db, "users"), wallet);

    try {
      const existingSnapshot = await getDoc(ref);
      if (!existingSnapshot.exists()) {
        return false;
      }

      const userData = existingSnapshot.data() as UserData;
      const { stakeInfo } = userData;

      const newStackInfo = {
        ...stakeInfo,
        [stakedOn]: {
          ...stakeData,
        },
      } as Record<string, StakeInfo>;

      /**
       * parent data starts
       */
      const parentQuery = query(
        usersCollection,
        where("code", "==", userData.by)
      );

      const paretDataSnapshot = await getDocs(parentQuery);

      const parentDoc = paretDataSnapshot.docs[0];

      const stakeType = stakeData.coin === "BNB" ? "stakedBNB" : "stakedUSDT";

      await updateDoc(ref, {
        ...userData,
        stakeInfo: newStackInfo,
        [`${stakeType}`]: userData[stakeType]
          ? userData[stakeType] + value
          : value,
      });

      if (userData.by) {
        // const data = parentSnapshot[0] as UserData;
        if (parentDoc.exists()) {
          const { groupStakes, wallet } = parentDoc.data() as UserData;

          const newGroupStakes = groupStakes
            ? groupStakes + value
            : groupStakes;

          await updateDoc(doc(collection(db, "users"), wallet), {
            groupStakes: newGroupStakes,
          });
        }
      }

      return true;
    } catch (error) {
      console.error("Error adding NFT:", error);
      return false;
    }
  },
};
