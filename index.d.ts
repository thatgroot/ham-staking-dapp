interface FlexProps
  extends React.HTMLAttributes<HTMLElement>,
    React.CSSProperties {
  as?: "div" | "main" | "nav";
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexWrap?: CSSProperties["flexWrap"];
  gap?: CSSProperties["gap"];
  children: React.ReactNode;
}

type Coin = "USDT" | "BNB";

type StakeDuration = 200 | 365 | 500;

interface DistributionEntry {
  name: string;
  level: number;
  received: number;
}

interface StakeInfo {
  coin: Coin;
  wallet: string;
  name: string;
  amount: number;
  /**
   * @duration: in days
   */
  duration: number;
  /**
   * @stakedOn: milliseconds string value of date
   */
  stakedOn: string;
}
interface UserData {
  name: string;
  code: string;
  wallet: string;
  by: string;
  byParent: string;
  referralCount?: number;
  /**
   * user stake info based on timestamp [string]
   */
  stakeInfo?: Record<string, StakeInfo>;
  groupUSDTStakes?: number;
  groupBNBStakes?: number;
  stakedBNB?: number;
  stakedUSDT?: number;
  stakeClaimed?: number;
  // usdt stakes earning
  usdtReferralsEarning?: number;
  // bnb stakes earning
  bnbReferralsEarning?: number;
  /**
   * @stakedOn: milliseconds number value of date
   */
  createdAt?: number;
}

interface Referral {
  level: number;
  data: UserData;
  children: Referral[];
}
interface ReferralData {
  wallet: string;
  code: string;
  by: string;
}

interface Withdraw {
  type: "Staking APY" | "Referral Earning";
  coin: Coin;
  amount: number;
  toWallet: `0x${string}`;
  requestedBy: `0x${string}`;
  requestedOn: number;
  status: "requested" | "rejected" | "accepted";
}

interface UserWithdraws {
  [key: number]: Withdraw;
}
