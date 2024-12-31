import { commissionRates } from "@/config/rates";
import { ReferralService } from "@/services/referral";

export async function calculateCommissionsForParents(
  address: `0x${string}`,
  value: number,
  coin: Coin
): Promise<{ [key: string]: number }> {
  if (!address) return {};
  const earningType =
    coin === "USDT" ? "usdtReferralsEarning" : "bnbReferralsEarning";
  const groupStakesType =
    coin === "USDT" ? "groupUSDTStakes" : "groupBNBStakes";
  const parentTree = await ReferralService.getParentReferrals(address);
  const commissionCalculations: { [key: string]: number } = {};

  async function calculateCommission(tree: Referral) {
    async function doCalculation(parent: Referral) {
      let updatedEarnings = 0;

      const commissionRate = commissionRates[parent.level - 1];
      const commission = value * commissionRate;

      const directReferralsCount =
        await ReferralService.getDirectReferralsCount(parent.data.code);

      if (
        parent.level === 2 &&
        directReferralsCount >= 2 &&
        (parent.data[groupStakesType] ?? 0) >= 2500
      ) {
        updatedEarnings = parent.data[earningType]
          ? parent.data[earningType] + value * 0.15
          : value * 0.15;
      } else {
        updatedEarnings = parent.data[earningType]
          ? parent.data[earningType] + commission
          : commission;
      }
      commissionCalculations[parent.data.wallet] = updatedEarnings;
    }
    for (const key in tree.children) {
      if (Object.prototype.hasOwnProperty.call(tree.children, key)) {
        const parent = tree.children[key];
        await doCalculation(parent);
        if (parent.children.length > 0) {
          await calculateCommission(parent); // Recurse
        }
      }
    }

    return commissionCalculations;
  }

  await calculateCommission(parentTree);

  return commissionCalculations;
}
