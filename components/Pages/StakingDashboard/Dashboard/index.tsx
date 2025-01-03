"use client";
import hamReward from "@/public/assets/refferralRewards.png";
import refferalEarning from "@/public/assets/totalearning.png";
import totalFriends from "@/public/assets/friends.png";
import Card from "@/components/ui/Dashboard/Card";
import Image from "next/image";
import {
  useUserAcceptedWithdraws,
  useUserReferrals,
  useUserStakes,
} from "@/hooks/user";
import VBox from "@/components/ui/Directional/VBox";

import HBox from "@/components/ui/Directional/HBox";
import { notify } from "@/utils/notifications";
import Calculator from "@/components/Pages/StakingDashboard/Dashboard/components/Calculator";
import { ReferralsPage } from "@/components/Pages/Referrals";
import { MyStakes } from "@/components/Pages/StakingDashboard/Stake/MyStakes";
import { useUserAmountStatistic } from "@/hooks/statistic";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const { count } = useUserReferrals();

  const { statistic, loading } = useUserAmountStatistic();
  const {
    accepted,
    requested,
    loading: loadingAcceptedWithdraws,
  } = useUserAcceptedWithdraws();

  const {
    userData: user,
    claimableApy,
    loading: loadingStakes,
  } = useUserStakes(loadingAcceptedWithdraws);

  return (
    <div className="space-y-6">
      {/* Cards Section */}

      {
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-6">
          {loading || loadingStakes || loadingAcceptedWithdraws ? (
            <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            <>
              <Card
                title={"Claimable APY"}
                value={claimableApy}
                color
                icon={undefined}
              />
              {statistic?.map((item) => (
                <Card
                  key={item.key}
                  title={item.key}
                  value={item.value}
                  color
                  icon={undefined}
                />
              ))}

              <Card
                title={"Accepted Staking Withdraws"}
                value={accepted.staking}
                color
                icon={undefined}
              />
              <Card
                title={"Accepted Referral Withdraws"}
                value={accepted.referral}
                color
                icon={undefined}
              />

              <Card
                title={"Requested Staking Withdraws"}
                value={requested.staking}
                color
                icon={undefined}
              />
              <Card
                title={"Requested Referral Withdraws"}
                value={requested.referral}
                color
                icon={undefined}
              />
            </>
          )}
        </div>
      }

      {/* Referral Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* box */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden  dark:border-none border border-[#11C7FF] shadow-lg transition-all duration-300 dark:bg-gradient-to-b from-[#2DE96C] via-[#BEFF9E] to-[#F7FF5F] p-px">
          <div className="w-full p-4 md:p-6 bg-white dark:bg-[#0B0B0B] rounded-xl h-full">
            <div className="flex flex-col md:flex-row  w-full relative items-center md:items-center">
              <div className="flex-1 space-y-8 w-full">
                <div>
                  <h3 className="text-4xl mb-2 font-bold dark:text-white text-black leading-tight">
                    REFER FRIENDS.{" "}
                    <span className="gradient-text text-4xl">
                      EARN BY <br /> EACH FRIENDS
                    </span>{" "}
                    AFFILIATES.
                  </h3>
                  <p className="text-sm md:text-base text-[#036988] font-bold">
                    Earn Up To 12% Commission On Referrals stake
                  </p>
                </div>

                <div className="space-y-2 w-60 2xl:max-w-96 mt-6">
                  <p className="text-sm md:text-lg font-semibold text-[#11C7FF] dark:text-[#fff]">
                    Referral Link
                  </p>
                  <div className="flex gap-2">
                    <HBox
                      gap={12}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      className=" p-3 bg-[#DBF7FFBF] dark:focus:outline-[#2DE96C] text-[#1158ff] focus:outline-[#11C7FF] dark:text-[#fff] dark:bg-[#37463880] rounded-lg text-sm transition-all duration-300 focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-[#2DE96C]"
                    >
                      {user && (
                        <span className={"text-blue-500 underline"}>{`${
                          window.location.origin
                        }/signup/${user?.code ?? ""}`}</span>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `${window.location.origin}/signup/${
                                user?.code ?? ""
                              }`
                            )
                            .then(() => {
                              // notify({
                              //   content: "Referral link copied to clipboard!",
                              // });
                            })
                            .catch((err) => {
                              notify({
                                content: `Failed to copy ${err.message}`,
                                type: "error",
                              });
                            });
                        }}
                        className="px-6 py-2 bg-[#11C7FF] text-white dark:text-black rounded-lg text-sm font-medium transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50"
                      >
                        Copy
                      </button>
                    </HBox>
                  </div>
                </div>
              </div>

              <div className="max-w-96  ">
                <Image src={hamReward} alt="Mascot" className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Summary */}
        <div className="rounded-xl shadow-lg dark:border-none border border-[#11C7FF] dark:bg-gradient-to-b from-[#2DE96C] via-[#BEFF9E] to-[#F7FF5F] p-px h-full">
          <div className="bg-white rounded-xl dark:bg-[#0B0B0B] p-6 h-full">
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-green-400 mb-6">
              Referral Summary
            </h3>
            <VBox className="h-full">
              <VBox className={"space-y-4 flex-1"}>
                <HBox justifyContent={"space-between"} alignItems={"center"}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-[#00C3FF] dark:bg-[#2DE995D6] shadow-md">
                      <Image
                        alt="Total Friends"
                        src={totalFriends}
                        className="w-full max-w-6"
                      />
                    </div>
                    <span className="text-sm md:text-base font-bold text-black dark:text-gray-300">
                      Team Members
                    </span>
                  </div>
                  <span className="text-lg md:text-xl text-[#00C3FF] dark:text-white font-bold">
                    {count}
                  </span>
                </HBox>

                {[
                  {
                    icon: (
                      <Image
                        alt="Referral Earning"
                        src={refferalEarning}
                        className="w-full max-w-6 text-white "
                      />
                    ),
                    label: "Total Earnings",
                    value: "300k",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-[#00C3FF] dark:bg-[#2DE995D6] shadow-md">
                        {item.icon}
                      </div>
                      <span className="text-sm md:text-base font-bold text-black dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-lg md:text-xl text-[#00C3FF] dark:text-white font-bold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </VBox>

              <div className="flex items-center justify-between mt-6 flex-1">
                <button className="flex-1 px-6 w-full py-2 bg-[#11C7FF] text-white dark:text-black rounded-lg text-sm md:text-lg min-w-[150px]   font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50">
                  Claim Rewards
                </button>
              </div>
            </VBox>
          </div>
        </div>
      </div>

      <Calculator />

      <ReferralsPage />

      <MyStakes />
    </div>
  );
};

export default Dashboard;
