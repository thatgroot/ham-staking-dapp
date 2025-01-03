"use client";

import VBox from "@/components/ui/Directional/VBox";
import { dayDifference, timeStampToDate } from "@/lib/utils";
import { APYS } from "@/config/apys";

export default function WithdrawStatistic({
  data,
  withdrawRequests,
  coin,
  selectedStake,
  onSelectStakeAction,
}: {
  data: UserData;
  withdrawRequests: Withdraw[];
  coin: Coin;
  selectedStake: StakeInfo | undefined;
  onSelectStakeAction: (stake: StakeInfo) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data &&
        data.stakeInfo &&
        Object.keys(data.stakeInfo)
          .filter((key) => data.stakeInfo![key].coin === coin)
          .map((key, index) => {
            const stake = data.stakeInfo![key];
            const daysSinceStaked = dayDifference(
              new Date(),
              timeStampToDate(+stake.stakedOn)
            );
            const apyPercent = daysSinceStaked * APYS[stake.duration];
            const apy = ((stake.amount * apyPercent) / 100).toFixed(4);

            let apyClaimedDays = 0;
            let apyClaimableDays = 0;
            let stakedOn = 0;

            const withdrawRequestForTheStake = withdrawRequests[0];

            if (
              withdrawRequestForTheStake &&
              daysSinceStaked <= stake.duration
            ) {
              const requestedOnDate = timeStampToDate(
                withdrawRequestForTheStake.requestedOn
              );
              const stakedOnDate = timeStampToDate(+stake.stakedOn);

              apyClaimedDays = dayDifference(stakedOnDate, requestedOnDate);
              apyClaimableDays = daysSinceStaked - apyClaimedDays + 1;

              stakedOn = +(
                withdrawRequestForTheStake?.stakeInfo?.stakedOn || 0
              );
            }

            return (
              <VBox
                key={index}
                type="button"
                disabled={apyClaimableDays === 0}
                as="button"
                className={`flex-1 h-full mt-4 p-2 border border-gray-300 rounded-lg ${
                  apyClaimableDays === 0 ? "cursor-not-allowed" : ""
                } ${
                  stake.stakedOn === selectedStake?.stakedOn
                    ? "bg-[#11C7FF]/10"
                    : "bg-white"
                }`}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                onClick={() => onSelectStakeAction(stake)}
              >
                <VBox className="flex-1 w-full">
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-tl-md rounded-tr-md">
                    <span className="text-center">{stake.amount}</span>
                    <b className="text-center">{stake.coin}</b>
                  </p>
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2">
                    <b>Staked For</b>
                    <span className="text-center">{stake.duration}</span>
                    <span>Days</span>
                  </p>
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2">
                    <b>Days Since Staked</b>: {daysSinceStaked}
                  </p>
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-bl-md rounded-br-md">
                    <b>APY %</b>: {APYS[stake.duration]}
                  </p>
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-bl-md rounded-br-md">
                    <b>Max APY</b>: {stake.maxApy}
                  </p>
                  <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-bl-md rounded-br-md">
                    <b>Earned APY</b>: {apy}
                  </p>
                  {key === stakedOn.toString() && (
                    <>
                      <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-bl-md rounded-br-md">
                        <b>APY Claimed</b>: {apyClaimedDays} Days
                      </p>
                      <p className="flex gap-2 p-1 border border-gray-200 w-full px-2 rounded-bl-md rounded-br-md">
                        <b>APY Claim</b>: {apyClaimableDays} Days
                      </p>
                    </>
                  )}
                </VBox>
              </VBox>
            );
          })}
    </div>
  );
}
