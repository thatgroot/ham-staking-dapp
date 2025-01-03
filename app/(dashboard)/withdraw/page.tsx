"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/services/user";
import { useUserStakes, useUserWithdraw } from "@/hooks/user";
import HBox from "@/components/ui/Directional/HBox";
import { notify } from "@/utils/notifications";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dayDifference, timeStampToDate } from "@/lib/utils";
import { APYS } from "@/config/apys";

const coins = ["BNB", "USDT"];
const earnings = ["Staking APY", "Referral Earning"];

// Main Withdraw Component
const WithdrawScreen = () => {
  const { address } = useAccount();

  const [withdrawRequests, setWithdrawRequests] = useState<Withdraw[]>([]);
  const [requestingWithdraw, setRequestingWithdraw] = useState<boolean>(false);
  const {
    data: userStakes,
    userData: data,
    loading: loadingStakes,
  } = useUserStakes(requestingWithdraw);

  const {
    data: userWithdraws,
    loading: loadingWithdraws,
    // error: errorWithdrawFetch,
  } = useUserWithdraw(requestingWithdraw);

  const [formData, setFormData] = useState<Withdraw>();
  // data?.bnbReferralsEarning
  // data?.stakedBNB

  const [amountType, setAmountType] = useState<AmountType>();

  const [availableWithdrawAmount, setAvailableWithdrawAmount] =
    useState<number>(0);
  // message
  const [availableWithdrawAmountMessage, setAvailableWithdrawAmountMessage] =
    useState("");
  const [withdrawType, setWithdrawType] = useState<
    "Referral Earning" | "Staking APY"
  >("Staking APY");

  const [coin, setCoin] = useState<string>("USDT");

  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "coin" ? +e.target.value : e.target.value,
    } as Withdraw);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) {
      return;
    }

    if (!formData.amount || !coin || !formData.toWallet || !formData.type) {
      console.log("formData", formData);
      notify({
        content: `Please fill all fields`,
        type: "error",
      });
      return;
    }

    const requestType =
      formData.type === "Referral Earning" ? "ReferralEarning" : "StakingAPY";

    const requestedKey: keyof UserWithdraws = `totalRequested${requestType}${
      coin as Coin
    }`;

    if (
      formData &&
      userWithdraws &&
      userWithdraws[requestedKey] >=
        userWithdraws[requestedKey] + formData.amount
    ) {
      // Show error message
      notify({
        content: `Insufficient ${withdrawType} balance`,
        type: "error",
      });
      return;
    }

    const alreadyRequestedAmount = userWithdraws
      ? userWithdraws[
          `totalRequested${
            withdrawType === "Referral Earning"
              ? "ReferralEarning"
              : "StakingAPY"
          }${coin}`
        ] ?? 0
      : 0;

    console.log(alreadyRequestedAmount, +formData.amount);
    if (alreadyRequestedAmount + +formData.amount > availableWithdrawAmount) {
      notify({
        content: `Amount exceeds available balance`,
        type: "error",
      });
      return;
    }
    if (formData && availableWithdrawAmount >= formData.amount) {
      setRequestingWithdraw(true);

      await UserService.addWithdrawInfo({
        ...formData,
        amount: +formData.amount,
        requestedBy: address,
        coin,
        requestedOn: Date.now(),
        status: "requested",
      } as Withdraw);
      setRequestingWithdraw(false);
      // Show success message
      notify({
        content: `Withdraw request has been successfully submitted`,
        type: "success",
      });
    } else {
      // Show error message
      notify({
        content: `Insufficient ${withdrawType} balance`,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (address) {
      setFormData({
        ...formData,
        toWallet: address,
        requestedBy: address,
      } as Withdraw);
    }
  }, [address]);

  useEffect(() => {
    const amount =
      amountType === ("ReferralsEarning" as AmountType) && coin === "BNB"
        ? data?.bnbReferralsEarning ?? 0
        : withdrawType === "Referral Earning" && coin === "USDT"
        ? data?.usdtReferralsEarning ?? 0
        : withdrawType === "Staking APY" && coin === "BNB"
        ? data?.stakedBNB ?? 0 ?? 0
        : withdrawType === "Staking APY" && coin === "USDT"
        ? data?.stakedUSDT ?? 0
        : 0;

    const message =
      amountType === ("ReferralsEarning" as AmountType) && coin === "BNB"
        ? `BNB Referrals Earning`
        : withdrawType === "Referral Earning" && coin === "USDT"
        ? `USDT Referrals Earning`
        : withdrawType === "Staking APY" && coin === "BNB"
        ? `Staked BNB`
        : withdrawType === "Staking APY" && coin === "USDT"
        ? `Staked USDT`
        : "";

    setAvailableWithdrawAmountMessage(message);
    setAvailableWithdrawAmount(amount);
  }, [amountType, coin, withdrawType]);

  useEffect(() => {
    if (userWithdraws) {
      const tempWithdrawRequests: Withdraw[] = [];
      Object.keys(userWithdraws)
        .filter((key) => typeof userWithdraws[key] === "object")
        .forEach((key) => {
          const stake: Withdraw = userWithdraws[key];
          tempWithdrawRequests.push(stake);
          console.log("stake", stake);
        });
      setWithdrawRequests(tempWithdrawRequests);
    }
  }, [userWithdraws]);

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative p-[1px] shadow-lg rounded-xl bg-gradient-to-br from-[#11C7FF] to-[#00ff88] dark:from-[#00ff88] dark:to-[#11C7FF]"
      >
        <form
          onSubmit={handleSubmit}
          className="dark:bg-black bg-white rounded-xl p-6 space-y-6 flex flex-col"
        >
          <Select
            required
            onValueChange={(value: "Staking APY" | "Referral Earning") => {
              setAmountType(
                value === "Referral Earning" ? "ReferralsEarning" : "staked"
              );
              setWithdrawType(value);
              setFormData({
                ...formData,
                type: value,
              } as Withdraw);
            }}
          >
            <SelectTrigger className="w-full h-14 dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500">
              <SelectValue placeholder="Select Earnings" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-transparent">
                {earnings.map((earning, index) => (
                  <SelectItem
                    className="bg-transparent text-black"
                    key={index}
                    value={earning}
                  >
                    {earning}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            required
            defaultValue={coin}
            onValueChange={(value) => {
              setCoin(value);
              setFormData({
                ...formData,
                coin: value,
              } as Withdraw);
            }}
          >
            <SelectTrigger className="w-full h-14 dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500">
              <SelectValue placeholder="Select Earnings" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup className="bg-transparent">
                {coins.map((coin, index) => (
                  <SelectItem
                    className="bg-transparent text-black"
                    key={index}
                    value={coin}
                  >
                    {coin}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {data && (
            <div>
              <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
                Enter Amount to Withdraw
              </label>
              <HBox
                gap={12}
                className="dark:text-gray-300 text-gray-700 text-xs font-medium mb-2 block"
              >
                <span className="bg-green-100 px-1 rounded-sm">
                  {availableWithdrawAmountMessage} Available:{" "}
                  {availableWithdrawAmount}
                </span>

                {userWithdraws && (
                  <span className="bg-red-100 px-1 rounded-sm">
                    Requested:{" "}
                    {(
                      userWithdraws[
                        `totalRequested${
                          withdrawType === "Referral Earning"
                            ? "ReferralEarning"
                            : "StakingAPY"
                        }${coin}`
                      ] ?? 0
                    ).toFixed(4)}
                  </span>
                )}
              </HBox>

              <div className="relative">
                {userWithdraws &&
                (userWithdraws[
                  `totalRequested${
                    withdrawType === "Referral Earning"
                      ? "ReferralEarning"
                      : "StakingAPY"
                  }${coin}`
                ] ?? 0) >= availableWithdrawAmount ? (
                  <div className="w-full  py-6 dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"></div>
                ) : (
                  <input
                    required
                    disabled={withdrawType === "Staking APY"}
                    name="amount"
                    value={formData?.amount}
                    onChange={updateFormData}
                    placeholder={`e.g., 234`}
                    className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
                  />
                )}
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              </div>
            </div>
          )}

          <div>
            <label className="dark:text-gray-300 text-gray-700 text-sm font-medium mb-2 block">
              Enter Wallet Address
            </label>

            <div className="relative">
              <input
                required
                type="text"
                name="toWallet"
                defaultValue={address}
                onChange={updateFormData}
                placeholder="Wallet Address"
                className="w-full dark:bg-[#37463880] bg-[#11C7FF]/10 border border-[#11C7FF] dark:border-green-500 dark:text-white text-black p-4 rounded-xl focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-green-500"
              />
              {address ? (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff88]" />
              ) : (
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>

            {withdrawType === "Staking APY" && (
              <div className="relative">
                <Table>
                  <TableCaption>A list of your recent stakes.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Max APY</TableHead>
                      <TableHead>Received APY</TableHead>
                      <TableHead>Claimable APY </TableHead>
                      <TableHead>Staked On</TableHead>
                      <TableHead>Last Requested On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingStakes ? (
                      <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
                    ) : (
                      userStakes &&
                      userStakes.length > 0 &&
                      userStakes
                        .filter((stake) => stake.coin === coin)
                        .sort((a, b) => b.maxApy - a.maxApy)
                        .map((stake, index) => {
                          const claimableApy =
                            (stake.amount *
                              APYS[stake.duration] *
                              (stake.lastRequestedOn
                                ? dayDifference(
                                    timeStampToDate(stake.lastRequestedOn),
                                    new Date()
                                  )
                                : dayDifference(
                                    timeStampToDate(stake.stakedOn),
                                    new Date()
                                  ))) /
                            100;

                          return (
                            <TableRow key={`${stake.stakedOn}_${index}`}>
                              <TableCell className="font-medium">
                                {stake.coin}
                              </TableCell>
                              <TableCell className="font-medium">
                                <a
                                  className="text-blue-500 underline"
                                  href={`https://bscscan.com/address/${stake.wallet}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {stake.wallet.substring(0, 6)}...
                                  {stake.wallet.substring(
                                    stake.wallet.length - 4
                                  )}
                                </a>
                              </TableCell>

                              <TableCell className="font-medium">
                                {stake.amount}
                              </TableCell>
                              <TableCell className="font-medium">
                                {stake.duration}
                              </TableCell>
                              <TableCell className="font-medium">
                                {stake.maxApy}
                              </TableCell>
                              <TableCell className="font-medium">
                                {stake.receivedApy}
                              </TableCell>
                              <TableCell className="font-medium">
                                {claimableApy}
                              </TableCell>
                              <TableCell className="font-medium">
                                {timeStampToDate(
                                  stake.stakedOn
                                ).toLocaleDateString()}{" "}
                                {timeStampToDate(
                                  stake.stakedOn
                                ).toLocaleTimeString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                {stake.lastRequestedOn
                                  ? new Date(
                                      stake.lastRequestedOn
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {stake.status}
                              </TableCell>
                              <TableCell className="font-medium">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      stakeInfo: stake,
                                      amount: claimableApy,
                                      type: withdrawType,
                                    } as Withdraw);
                                  }}
                                  className="w-fit px-4 text-xs text-center py-1 bg-[#11C7FF] text-black rounded-lg   md:text-lg font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50"
                                >
                                  Select
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-[#00ff88] to-[#ffbb00] p-px rounded-lg">
            <button className="px-6 w-full text-center py-2 bg-[#11C7FF] text-black rounded-lg text-sm md:text-lg font-sem transition-all duration-300 dark:bg-[#2DE995] shadow-lg hover:bg-[#0FB8EC] focus:outline-none focus:ring-2 focus:ring-[#11C7FF] focus:ring-opacity-50">
              <span>
                {requestingWithdraw
                  ? "Requesting Withdraw ..."
                  : "Request Withdraw"}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
      <br />
      <Card>
        <CardHeader>
          <CardTitle>Your Withdraw Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent stakes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Request Type</TableHead>
                <TableHead>Coin</TableHead>
                <TableHead>Request By</TableHead>
                <TableHead>Receiver Wallet</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Requested On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingWithdraws ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                withdrawRequests &&
                withdrawRequests.map((withdraw, index) => {
                  return (
                    <TableRow key={`${withdraw.requestedBy}_${index}`}>
                      <TableCell className="font-medium">
                        {withdraw.type}
                      </TableCell>
                      <TableCell className="font-medium">
                        {withdraw.coin}
                      </TableCell>
                      <TableCell className="font-medium">
                        <a
                          className="text-blue-500 underline"
                          href={`https://bscscan.com/address/${withdraw.requestedBy}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {withdraw.requestedBy.substring(0, 6)}...
                          {withdraw.requestedBy.substring(
                            withdraw.requestedBy.length - 4
                          )}
                        </a>
                      </TableCell>
                      <TableCell className="font-medium">
                        {withdraw.toWallet && (
                          <a
                            className="text-blue-500 underline"
                            href={`https://bscscan.com/address/${withdraw.toWallet}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {withdraw.toWallet.substring(0, 6)}...
                            {withdraw.toWallet.substring(
                              withdraw.toWallet.length - 4
                            )}
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {withdraw.amount}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(withdraw.requestedOn).toLocaleDateString()}{" "}
                        {new Date(withdraw.requestedOn).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawScreen;
