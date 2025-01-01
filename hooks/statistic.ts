import { StatisticService } from "@/services/statistic";
import { useEffect, useState } from "react";

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
