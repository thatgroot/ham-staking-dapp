import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const STATISTIC_COLLECTION = collection(db, "statistic");
const DOC = "data";
const ref = doc(STATISTIC_COLLECTION, DOC);
export const StatisticService = {
  async updateStakes(statistic: Statistic): Promise<{
    newStatistic: Statistic;
  }> {
    const {
      userCount,
      bnbStakes,
      usdtStakes,
      usdtreferralEarning,
      bnbreferralEarning,
    } = statistic;

    const existingSnapshot = await getDoc(ref);

    if (existingSnapshot.exists()) {
      const data = existingSnapshot.data() as Statistic;
      const newStatistic = {
        userCount: data.userCount
          ? data.userCount + (userCount ?? 0)
          : userCount ?? 0,

        bnbStakes: +(
          data.bnbStakes ? data.bnbStakes + (bnbStakes ?? 0) : bnbStakes ?? 0
        ).toFixed(4),
        usdtStakes: +(
          data.usdtStakes
            ? data.usdtStakes + (usdtStakes ?? 0)
            : usdtStakes ?? 0
        ).toFixed(4),
        usdtreferralEarning: +(
          data.usdtreferralEarning
            ? data.usdtreferralEarning + (usdtreferralEarning ?? 0)
            : usdtreferralEarning ?? 0
        ).toFixed(4),
        bnbreferralEarning: +(
          data.bnbreferralEarning
            ? data.bnbreferralEarning + (bnbreferralEarning ?? 0)
            : bnbreferralEarning ?? 0
        ).toFixed(4),
      } as Statistic;
      updateDoc(ref, {
        ...newStatistic,
      });
      return { newStatistic };
    } else {
      const info = {
        userCount: userCount ?? 0,
        bnbStakes: bnbStakes ?? 0,
        usdtStakes: usdtStakes ?? 0,
        usdtreferralEarning: usdtreferralEarning ?? 0,
        bnbreferralEarning: bnbreferralEarning ?? 0,
      } as Statistic;
      setDoc(ref, info);
      return { newStatistic: info };
    }
  },

  async getStatistic(): Promise<Statistic> {
    const existingSnapshot = await getDoc(ref);
    if (existingSnapshot.exists()) {
      return existingSnapshot.data() as Statistic;
    } else {
      return {
        userCount: 0,
        bnbStakes: 0,
        usdtStakes: 0,
        usdtreferralEarning: 0,
        bnbreferralEarning: 0,
      };
    }
  },
};
