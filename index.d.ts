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
  groupStakes?: number;
  stakedBNB?: number;
  stakedUSDT?: number;
  stakeClaimed?: number;
  // usdt stakes earning
  usdtStakesEarning?: number;
  // bnb stakes earning
  bnbStakesEarning?: number;
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
