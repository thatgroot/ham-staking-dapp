import { StatisticService } from "@/services/statistic";
import { useEffect, useState } from "react";
import { useUserData } from "./user";

export const useStatistic = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statistic, setStatistic] = useState<Statistic>();

  useEffect(() => {
    setLoading(true);
    StatisticService.getStatistic().then((data) => {
      setStatistic(data);
      setLoading(false);
    });
  }, []);

  return { statistic, loading };
};

export const useUserAmountStatistic = () => {
  const { data: userData, loading, error } = useUserData();

  const [statistic, setStatistic] =
    useState<{ key: string; value: number }[]>();

  useEffect(() => {
    if (userData) {
      const bnbreferralEarning = userData.bnbReferralsEarning ?? 0;
      const usdtreferralEarning = userData.usdtReferralsEarning ?? 0;
      const bnbStakes = userData.stakedBNB ?? 0;
      const usdtStakes = userData.stakedUSDT ?? 0;

      const groupBNBStakes = userData.groupBNBStakes ?? 0;
      const groupUSDTStakes = userData.groupUSDTStakes ?? 0;

      const bnbEarningMessage = `BNB Referrals Earning`;
      const usdtEarningMessage = `USDT Referrals Earning`;
      const bnbStakesMessage = `Staked BNB`;
      const usdtStakesMessage = `Staked USDT`;
      const bnbGroupStakesMessage = `Group BNB Stakes`;
      const usdtGroupStakesMessage = `Group USDT Stakes`;

      const data = [
        { key: bnbEarningMessage, value: bnbreferralEarning },
        { key: usdtEarningMessage, value: usdtreferralEarning },
        { key: bnbStakesMessage, value: bnbStakes },
        { key: usdtStakesMessage, value: usdtStakes },
        { key: bnbGroupStakesMessage, value: groupBNBStakes },
        { key: usdtGroupStakesMessage, value: groupUSDTStakes },
      ];

      setStatistic(data);
    }
  }, [userData]);

  return { statistic, loading, error };
};
