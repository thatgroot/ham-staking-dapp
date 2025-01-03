"use client";

import { LoaderCircle } from "lucide-react";
import { useAllWithdrawRequests } from "@/hooks/user";
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
import CustomCard from "@/components/ui/Dashboard/Card";
import Button from "@/components/ui/Main/Button";
import { useSendBnb, useSendUSTD } from "@/hooks/transactions";
import VBox from "@/components/ui/Directional/VBox";

import HBox from "@/components/ui/Directional/HBox";
import { useStatistic } from "@/hooks/statistic";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user";

const titles = {
  userCount: "Total Users",
  bnbStakes: "Total BNB Stakes",
  usdtStakes: "Total USDT Stakes",
  usdtreferralEarning: "Total USDT Referral Earnings",
  bnbreferralEarning: "Total BNB Referral Earnings",
};
// Main Withdraw Component
const WithdrawScreen = () => {
  const [stakeKey, setStakeKey] = useState<number>();

  const {
    sendBnb,
    isConfirmed: isBNBSendConfirmed,
    isPending: isBNBSendPending,
  } = useSendBnb();
  const {
    isSuccess: isUSDTTransferConfirmed,
    sendUSTD,
    isLoading: isUSDTSendPending,
  } = useSendUSTD();
  const { data: withdrawRequests, loading } = useAllWithdrawRequests(
    isUSDTTransferConfirmed || isBNBSendConfirmed
  );

  const [requestedByWallet, setRequestedByWallet] = useState<string>();
  const [withdrawRequestedOn, setWithdrawRequestedOn] = useState<number>();

  const { statistic } = useStatistic();

  function distributeRewards(withdraw: Withdraw) {
    const { toWallet, coin, type, amount, requestedBy, requestedOn } = withdraw;
    setStakeKey(withdraw.stakeInfo.stakedOn);
    setRequestedByWallet(requestedBy);
    setWithdrawRequestedOn(requestedOn);

    if (type === "Referral Earning") {
      if (coin === "BNB") {
        sendBnb(toWallet, amount);
      } else {
        sendUSTD(toWallet, amount);
      }
    } else if (type === "Staking APY") {
      // const apy = amount * APYS[withdraw];
      if (coin === "BNB") {
        sendBnb(toWallet, amount);
      } else {
        sendUSTD(toWallet, amount);
      }
    }
  }

  useEffect(() => {
    console.log(isBNBSendConfirmed, isUSDTTransferConfirmed);
    if (isBNBSendConfirmed || isUSDTTransferConfirmed) {
      if (requestedByWallet && stakeKey && withdrawRequestedOn) {
        UserService.updateSpecificStake({
          wallet: requestedByWallet,
          stakedOn: stakeKey,
          status: "accepted",
          withdrawRequestedOn: withdrawRequestedOn,
        });
      }
    }
  }, [isUSDTTransferConfirmed, isBNBSendConfirmed]);

  return (
    <VBox gap={12}>
      <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
        {statistic &&
          Object.keys(statistic)
            .filter((key) => key !== "stakes")
            .map((key) => {
              return (
                <CustomCard
                  key={key}
                  title={titles[key]}
                  icon={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Referral BNB Stakes"
                      src={"/dashboard/balance.png"}
                      width={100}
                      height={100}
                      className="w-full"
                    />
                  }
                  color
                  value={statistic[key as keyof Statistic]}
                />
              );
            })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Requests</CardTitle>
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                withdrawRequests &&
                withdrawRequests.map((withdraw) => {
                  return (
                    <TableRow key={withdraw.requestedBy}>
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
                      </TableCell>
                      <TableCell className="font-medium">
                        {withdraw.amount}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(withdraw.requestedOn).toLocaleDateString()}{" "}
                        {new Date(withdraw.requestedOn).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        <HBox gap={12}>
                          <Button
                            className="w-fit h-[18px] py-4 px-0 text-center"
                            onClick={() => {
                              distributeRewards(withdraw);
                            }}
                            icon={undefined}
                          >
                            <span>
                              {isBNBSendPending || isUSDTSendPending ? (
                                <>
                                  <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                </>
                              ) : (
                                "Distribute"
                              )}
                            </span>
                          </Button>
                        </HBox>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </VBox>
  );
};

export default WithdrawScreen;
