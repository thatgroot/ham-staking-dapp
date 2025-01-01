"use client";
import hamReward from "@/public/assets/refferralRewards.png";
import refferalEarning from "@/public/assets/totalearning.png";
import totalFriends from "@/public/assets/friends.png";
import Card from "@/components/UI/Dashboard/Card";
import Image from "next/image";
import Calculator from "./components/Calculator";
import { useUserData, useUserReferrals } from "@/hooks/user";
import { HBox, VBox } from "@/components/UI/Directional/flex";
import { notify } from "@/utils/notifications";
import { ReferralsPage } from "../../Referrals";
import { MyStakes } from "../Stake/MyStakes";

const Dashboard = () => {
  const { data: user } = useUserData();
  const { count } = useUserReferrals();

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-6">
          <Card
            title={"BNB Stakes"}
            icon={
              <Image
                alt="BNB Stakes"
                src={"/dashboard/stake.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.stakedBNB ?? 0}
            color
          />

          <Card
            title={"USDT Stakes"}
            icon={
              <Image
                alt="USDT Stakes"
                src={"/dashboard/stake.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.stakedUSDT ?? 0}
            color
          />

          <Card
            title={"BNB Referrals Earning"}
            icon={
              <Image
                alt="BNB Referrals Earning"
                src={"/dashboard/balance.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.bnbReferralsEarning?.toFixed(4) ?? 0}
            color
          />
          <Card
            title={"USDT Referrals Earning"}
            icon={
              <Image
                alt="USDT Referrals Earning"
                src={"/dashboard/balance.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.usdtReferralsEarning?.toFixed(4) ?? 0}
            color
          />

          <Card
            title={"Referral USDT Stakes"}
            icon={
              <Image
                alt="Referral USDT Stakes"
                src={"/dashboard/balance.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.groupUSDTStakes ?? 0}
            color
          />

          <Card
            title={"Referral BNB Stakes"}
            icon={
              <Image
                alt="Referral BNB Stakes"
                src={"/dashboard/balance.png"}
                width={100}
                height={100}
                className="w-full"
              />
            }
            value={user.groupBNBStakes ?? 0}
            color
          />
        </div>
      )}

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
