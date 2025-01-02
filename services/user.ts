import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { calculateCommissionsForParents } from "@/utils/comission-calculation";
import { StatisticService } from "./statistic";
const USERS_COLLECTION = collection(db, "users");
const WITHDRAW_COLLECTION = collection(db, "withdraw_requests");

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
    const { stakedOn, coin } = stakeData;

    const batch = writeBatch(db);
    const currentRef = doc(collection(db, "users"), wallet);

    try {
      const existingSnapshot = await getDoc(currentRef);
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
        USERS_COLLECTION,
        where("code", "==", userData.by)
      );

      const paretDataSnapshot = await getDocs(parentQuery);

      const parentDoc = paretDataSnapshot.docs[0];

      const stakeType = stakeData.coin === "BNB" ? "stakedBNB" : "stakedUSDT";
      const referralEarningType =
        stakeData.coin === "BNB"
          ? "bnbReferralsEarning"
          : "usdtReferralsEarning";

      batch.update(currentRef, {
        ...userData,
        stakeInfo: newStackInfo,
        [`${stakeType}`]: userData[stakeType]
          ? userData[stakeType] + value
          : value,
      });

      if (userData.by) {
        // const data = parentSnapshot[0] as UserData;
        if (parentDoc.exists()) {
          const { groupUSDTStakes, groupBNBStakes, wallet } =
            parentDoc.data() as UserData;

          const groupStakesKey =
            coin === "BNB" ? "groupBNBStakes" : "groupUSDTStakes";

          const groupStakes = coin === "BNB" ? groupBNBStakes : groupUSDTStakes;

          const newGroupStakes = groupStakes
            ? groupStakes + value
            : groupStakes;

          batch.update(doc(collection(db, "users"), wallet), {
            [`${groupStakesKey}`]: newGroupStakes,
          });
        }
      }

      const commissionCalculations: {
        [key: string]: number;
      } = await calculateCommissionsForParents(wallet, value, coin);
      let accumulatedCommissions = 0;

      for (const wallet in commissionCalculations) {
        if (
          Object.prototype.hasOwnProperty.call(commissionCalculations, wallet)
        ) {
          const comission = commissionCalculations[wallet];
          accumulatedCommissions += comission;

          batch.update(doc(collection(db, "users"), wallet), {
            [referralEarningType]: +comission.toFixed(4),
          });
          console.log("comission", {
            [wallet]: {
              [referralEarningType]: comission,
            },
          });
        }
      }
      await StatisticService.updateStakes({
        bnbStakes: coin === "BNB" ? value : 0,
        usdtStakes: coin === "USDT" ? value : 0,
        usdtreferralEarning: coin === "USDT" ? accumulatedCommissions : 0,
        bnbreferralEarning: coin === "BNB" ? accumulatedCommissions : 0,
      });

      batch.commit();

      return true;
    } catch (error) {
      console.error("Error adding NFT:", error);
      return false;
    }
  },
  updateSpecificStake: async ({
    wallet,
    stakedOn,
    status,
    withdrawRequestedOn,
  }: {
    wallet: string;
    stakedOn: number;
    status: StakeStatus;
    withdrawRequestedOn: number;
  }): Promise<boolean> => {
    const currentRef = doc(collection(db, "users"), wallet);

    try {
      const existingSnapshot = await getDoc(currentRef);
      if (!existingSnapshot.exists()) {
        return false;
      }

      const userData = existingSnapshot.data() as UserData;
      const { stakeInfo } = userData;

      if (stakeInfo) {
        await updateDoc(currentRef, {
          stakeInfo: {
            ...stakeInfo,
            [stakedOn]: {
              ...stakeInfo[stakedOn],
              status: status,
            },
          },
        });

        const withdrawDoc = doc(WITHDRAW_COLLECTION, wallet);
        const existingSnapshot = await getDoc(withdrawDoc);
        if (existingSnapshot.exists()) {
          const oldWithdraws = existingSnapshot.data() as UserWithdraws;

          await updateDoc(withdrawDoc, {
            [withdrawRequestedOn]: {
              ...oldWithdraws[withdrawRequestedOn],
              status: status,
              stakeInfo: {
                ...oldWithdraws[withdrawRequestedOn].stakeInfo,
                status: status,
              },
            },
          });
        }
      }
      return true;
    } catch (error) {
      console.error("Error adding NFT:", error);
      return false;
    }
  },
  addWithdrawInfo: async (info: Withdraw): Promise<boolean> => {
    const { requestedBy, requestedOn } = info;

    const requestType =
      info.type === "Referral Earning" ? "ReferralEarning" : "StakingAPY";

    const requestedKey: keyof UserWithdraws = `totalRequested${requestType}${info.coin}`;
    const acceptedKey: keyof UserWithdraws = `totalAccepted${requestType}${info.coin}`;

    const withdrawDoc = doc(WITHDRAW_COLLECTION, requestedBy);
    const existingSnapshot = await getDoc(withdrawDoc);

    try {
      const userDoc = doc(USERS_COLLECTION, requestedBy);
      const existingUserSnapshot = await getDoc(userDoc);
      const userData = existingUserSnapshot.data() as UserData;

      if (existingSnapshot.exists()) {
        const oldWithdraws = existingSnapshot.data() as UserWithdraws;

        await updateDoc(withdrawDoc, {
          ...oldWithdraws,
          [requestedOn]: {
            ...info,
          },
          [acceptedKey]: oldWithdraws[acceptedKey] ?? 0,
          [requestedKey]: (oldWithdraws[requestedKey] ?? 0) + info.amount,
        });
      } else {
        await setDoc(withdrawDoc, {
          [requestedOn]: {
            ...info,
          },
          [acceptedKey]: 0,
          [requestedKey]: +info.amount,
        });
      }

      if (requestType === "StakingAPY") {
        await updateDoc(userDoc, {
          stakeInfo: {
            ...userData.stakeInfo,
            [info.stakeInfo.stakedOn]: {
              ...info.stakeInfo,
              // only be updated by admin so that only accepted withdraws are updated
              lastRequestedOn: requestedOn,
              status: "requested",
            },
          },
        });
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  },
};
