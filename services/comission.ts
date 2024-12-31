import { commissionRates } from "@/config/rates";

export const ComissionService = {
  async calculateNFTCommissions(currentNode: Referral): Promise<{
    totalCommission: number;
    distribution: Record<string, DistributionEntry>;
  }> {
    if (currentNode.data.stakeInfo) {
      return {
        totalCommission: 0,
        distribution: {},
      };
    }
    if (
      currentNode.data.stakedBNB &&
      currentNode.data.stakedBNB <= 50 &&
      currentNode.data.stakedUSDT &&
      currentNode.data.stakedUSDT <= 50
    ) {
      return {
        totalCommission: 0,
        distribution: {},
      };
    }

    const totalCommission = +((currentNode.data.stakedUSDT ?? 0) * 0.2).toFixed(
      4
    );
    const distribution: Record<string, DistributionEntry> = {};

    const calculateCommission = (node: Referral, stakedUSDT: number) => {
      if (node.level > 0 && node.level <= commissionRates.length) {
        const rate = commissionRates[node.level - 1];

        const commission = +(stakedUSDT * rate).toFixed(4);

        if (!distribution[node.data.wallet]) {
          distribution[node.data.wallet] = {
            level: node.level,
            name: node.data.name,
            received: commission,
          };
        } else {
          distribution[node.data.wallet].received += commission;
        }
      }

      node.children.forEach((child) =>
        calculateCommission(child, child.data.stakedUSDT ?? 0)
      );
    };

    calculateCommission(currentNode, currentNode.data.stakedUSDT ?? 0);

    const filteredDistribution = Object.fromEntries(
      Object.entries(distribution).filter(([, entry]) => entry.received > 0)
    );

    return {
      totalCommission,
      distribution: filteredDistribution,
    };
  },
  async calculateStakeCommissions(currentNode: Referral): Promise<{
    totalCommission: number;
    distribution: Record<string, DistributionEntry>;
  }> {
    if (!currentNode.data.stakeInfo) {
      return {
        totalCommission: 0,
        distribution: {},
      };
    }

    // If stake amounts are low, return 0 commission
    if (
      currentNode.data.stakedBNB &&
      currentNode.data.stakedBNB <= 50 &&
      currentNode.data.stakedUSDT &&
      currentNode.data.stakedUSDT <= 50
    ) {
      return {
        totalCommission: 0,
        distribution: {},
      };
    }

    // Calculate the total commission based on the user's own stake
    const totalCommission = +((currentNode.data.stakedUSDT ?? 0) * 0.2).toFixed(
      4
    );
    const distribution: Record<string, DistributionEntry> = {};

    // Function to calculate commission for each node and its children
    const calculateCommission = (
      node: Referral,
      directReferralsCount: number
    ) => {
      let rate = 0;

      if (node.level > 0 && node.level <= commissionRates.length) {
        rate = commissionRates[node.level - 1];
      }

      // Apply additional rewards if conditions are met
      if (
        node.level === 2 &&
        directReferralsCount >= 5 &&
        (node.data.groupUSDTStakes ?? 0) >= 2500
      ) {
        rate = 0.15; // Apply 15% instead of 5% for 2nd-level referral
      }

      // Calculate commission for the current node
      const commission = +((currentNode.data.stakedUSDT ?? 0) * rate).toFixed(
        4
      );

      // Add the commission to the distribution record
      if (rate && !distribution[node.data.wallet]) {
        distribution[node.data.wallet] = {
          level: node.level,
          name: node.data.name,
          received: commission,
        };
      } else if (rate) {
        distribution[node.data.wallet].received += commission;
      }

      // Recursively calculate commission for children
      node.children.forEach((child) => {
        calculateCommission(
          child,
          currentNode.children.length // Pass the direct referral count
        );
      });
    };

    // Start the commission calculation with the root node
    calculateCommission(
      currentNode,
      currentNode.children.length // Direct referrals count
    );

    // Filter out nodes with no received commission
    const filteredDistribution = Object.fromEntries(
      Object.entries(distribution).filter(([, entry]) => entry.received > 0)
    );

    console.log(
      JSON.stringify({
        totalCommission,
        distribution: filteredDistribution,
      })
    );
    return {
      totalCommission,
      distribution: filteredDistribution,
    };
  },
};
