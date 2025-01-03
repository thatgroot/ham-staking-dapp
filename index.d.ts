interface FlexProps
  extends React.HTMLAttributes<HTMLElement>,
    React.CSSProperties {
  as?: "div" | "main" | "nav" | "button";
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexWrap?: CSSProperties["flexWrap"];
  gap?: CSSProperties["gap"];
  children: React.ReactNode;
}

type Coin = "USDT" | "BNB";
type StakeStatus = "requested" | "rejected" | "accepted";
type StakeDuration = 200 | 365 | 500;

interface DistributionEntry {
  name: string;
  level: number;
  received: number;
}

interface StakeInfo {
  coin: Coin;
  wallet: string;
  amount: number;
  duration: number;
  maxApy: number;
  receivedApy?: number;

  stakedOn: number;

  lastRequestedOn?: number;

  status?: StakeStatus;
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
type EarningType = "Staking APY" | "Referral Earning";
type AmountType = "staked" | "ReferralsEarning";
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
  type: EarningType;
  coin: Coin;
  amount: number;
  toWallet: `0x${string}`;
  requestedBy: `0x${string}`;
  requestedOn: number;
  duration: number;
  stakeInfo: StakeInfo;
  status: "requested" | "rejected" | "accepted";
}

interface UserWithdraws {
  [key: number]: Withdraw;
  totalRequestedReferralEarningUSDT: number;
  totalRequestedReferralEarningBNB: number;
  totalAcceptedReferralEarningUSDT: number;
  totalAcceptedReferralEarningBNB: number;
  totalRequestedStakingAPYUSDT: number;
  totalRequestedStakingAPYBNB: number;
  totalAcceptedStakingAPYUSDT: number;
  totalAcceptedStakingAPYBNB: number;
}

interface Statistic {
  userCount?: number;
  bnbStakes?: number;
  usdtStakes?: number;
  usdtreferralEarning?: number;
  bnbreferralEarning?: number;
}
