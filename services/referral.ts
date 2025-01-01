import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { StatisticService } from "./statistic";

export const ReferralService = {
  usersCollection: collection(db, "users"),

  async generateReferralCode(length = 8): Promise<string> {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Generate a random byte array
    const random = crypto.getRandomValues(new Uint8Array(16));

    // Convert the timestamp to a byte array
    const timestamp = Date.now().toString();
    const timestampBytes = new TextEncoder().encode(timestamp);

    // Combine the random bytes and timestamp bytes into a single array
    const combined = new Uint8Array(random.length + timestampBytes.length);
    combined.set(random);
    combined.set(timestampBytes, random.length);

    // Hash the combined array with SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", combined);
    const hashBytes = new Uint8Array(hashBuffer);

    // Generate the referral code by mapping the hash bytes to characters
    const code = Array.from(hashBytes)
      .slice(0, length)
      .map((byte) => chars[byte % chars.length])
      .join("");

    return code;
  },

  async checkUserExistence(wallet: string): Promise<boolean> {
    const ref = doc(this.usersCollection, wallet);
    const existingSnapshot = await getDoc(ref);
    try {
      const exists = existingSnapshot.exists();
      return exists;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
  async getUser(wallet: string): Promise<UserData | undefined> {
    const existingSnapshot = await getDoc(doc(this.usersCollection, wallet));
    if (existingSnapshot.exists()) {
      return existingSnapshot.data() as UserData;
    } else {
      return;
    }
  },
  async registerUser({
    wallet,
    name,
    by = "",
  }: {
    wallet: string;
    name: string;
    by: string;
  }): Promise<{
    exists: boolean;
    created: boolean;
    data: UserData;
  }> {
    console.log("by", by);
    const existingSnapshot = await getDoc(doc(this.usersCollection, wallet));

    if (existingSnapshot.exists()) {
      const data = existingSnapshot.data() as UserData;
      return {
        exists: true,
        created: false,
        data,
      };
    }
    // add Referral Data
    const code = await this.generateReferralCode();

    let byParent = "";
    if (by) {
      console.log("by", by);
      const invitedUsersQuery = query(
        this.usersCollection,
        where("code", "==", by)
      );
      const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

      const doc = invitedUsersSnapshot.docs[0];

      if (doc.exists()) {
        const data = doc.data() as UserData;
        console.log("user data", data);
        byParent = data.by ?? "";
      }
    }

    const userData: UserData = {
      wallet,
      code,
      name,
      by,
      byParent,
      groupBNBStakes: 0,
      groupUSDTStakes: 0,
      createdAt: Date.now(),
    };
    await setDoc(doc(this.usersCollection, wallet), userData);

    await StatisticService.updateStakes({ userCount: 1 });

    return {
      exists: false,
      created: true,
      data: userData,
    };
  },
  async addReferral(by: string, myRefCode = ""): Promise<string> {
    const byDoc = doc(this.usersCollection, by);
    const docSnapshot = await getDoc(byDoc);
    if (!docSnapshot.exists()) {
      return "";
    }

    const data = docSnapshot.data() as UserData;
    const byParent = data.by;
    const refCode = myRefCode || (await this.generateReferralCode(7));

    const refDoc = doc(this.usersCollection, refCode);
    const refSnapshot = await getDoc(refDoc);
    const refData: Partial<UserData> = {
      code: refCode,
      by: by,
      byParent: byParent,
    };

    if (refSnapshot.exists()) {
      await setDoc(refDoc, refData, { merge: true });
    } else {
      refData.name = "";
      await setDoc(refDoc, refData as UserData);
    }

    return refCode;
  },
  async getReferrals(wallet: string): Promise<Referral | undefined> {
    const buildReferralTree = async (
      userId: string,
      depth: number,
      visited: Set<string>
    ): Promise<Referral | null> => {
      // Prevent infinite loops by keeping track of visited nodes
      if (visited.has(userId)) {
        return null;
      }
      visited.add(userId);

      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserData;
      if (!userData) {
        return null;
      }

      const node: Referral = {
        data: userData,
        level: depth,
        children: [],
      };

      if (depth < 9 && userData.code) {
        const invitedUsersQuery = query(
          this.usersCollection,
          where("by", "==", userData.code)
        );
        const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

        for (const doc of invitedUsersSnapshot.docs) {
          const childNode = await buildReferralTree(doc.id, depth + 1, visited);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      }

      return node;
    };

    const rootNode = await buildReferralTree(wallet, 0, new Set<string>());

    // Ensure that the return type is always a Referral
    if (!rootNode) {
      return;
    }

    return rootNode;
  },
  async get2LevelReferrals(wallet: string): Promise<Referral> {
    const buildReferralTree = async (
      userId: string,
      depth: number,
      visited: Set<string>
    ): Promise<Referral | null> => {
      // Prevent infinite loops by keeping track of visited nodes
      if (visited.has(userId)) {
        return null;
      }
      visited.add(userId);

      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserData;
      if (!userData) {
        return null;
      }

      const node: Referral = {
        data: userData,
        level: depth,
        children: [],
      };

      if (depth < 2 && userData.code) {
        const invitedUsersQuery = query(
          this.usersCollection,
          where("by", "==", userData.code)
        );
        const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

        for (const doc of invitedUsersSnapshot.docs) {
          const childNode = await buildReferralTree(doc.id, depth + 1, visited);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      }

      return node;
    };

    const rootNode = await buildReferralTree(wallet, 0, new Set<string>());

    // Ensure that the return type is always a Referral
    if (!rootNode) {
      throw new Error(`No referral data found for wallet: ${wallet}`);
    }

    return rootNode;
  },
  async getDirectReferralsCount(code: string): Promise<number> {
    const invitedUsersQuery = query(
      this.usersCollection,
      where("by", "==", code)
    );
    const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

    return invitedUsersSnapshot.docs.length;
  },
  async getReferralTree(wallet: string, maxDepth: number): Promise<Referral> {
    const buildReferralTree = async (
      userId: string,
      depth: number,
      visited: Set<string>
    ): Promise<Referral | null> => {
      // Prevent infinite loops by keeping track of visited nodes
      if (visited.has(userId)) {
        return null;
      }
      visited.add(userId);

      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserData;
      if (!userData) {
        return null;
      }

      const node: Referral = {
        data: userData,
        level: depth,
        children: [],
      };

      if (depth < maxDepth && userData.code) {
        const invitedUsersQuery = query(
          this.usersCollection,
          where("by", "==", userData.code)
        );
        const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

        for (const doc of invitedUsersSnapshot.docs) {
          const childNode = await buildReferralTree(doc.id, depth + 1, visited);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      }

      return node;
    };

    const rootNode = await buildReferralTree(wallet, 0, new Set<string>());

    // Ensure that the return type is always a Referral
    if (!rootNode) {
      throw new Error(`No referral data found for wallet: ${wallet}`);
    }

    return rootNode;
  },
  async getImediateParent(wallet: string): Promise<UserData | null> {
    const userDoc = await getDoc(doc(this.usersCollection, wallet));
    if (userDoc.exists()) {
      const me = userDoc.data() as UserData;
      const invitedUsersQuery = query(
        this.usersCollection,
        where("code", "==", me.by)
      );
      const parentSnapshot = await getDocs(invitedUsersQuery);
      const parentData =
        parentSnapshot.docs.length > 0
          ? (parentSnapshot.docs[0].data() as UserData)
          : null;

      return parentData;
    }

    return null;
  },
  async getParentReferrals(wallet: string): Promise<Referral> {
    const buildReferralTree = async (
      userId: string,
      depth: number,
      visited: Set<string>
    ): Promise<Referral | null> => {
      // Prevent infinite loops by keeping track of visited nodes
      if (visited.has(userId)) {
        return null;
      }
      visited.add(userId);

      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as UserData;
      if (!userData) {
        return null;
      }

      // Create the node for this user
      const node: Referral = {
        data: userData,
        level: depth,
        children: [],
      };

      // If the depth is less than 9, try to go to the parent by the `by` field
      if (depth < 9 && userData.by) {
        const invitedUsersQuery = query(
          this.usersCollection,
          where("code", "==", userData.by)
        );
        const parentSnapshot = await getDocs(invitedUsersQuery);
        for (const doc of parentSnapshot.docs) {
          const parentData = doc.data() as UserData;
          // Recursively build the parent node
          const parentNode: Referral | null = await buildReferralTree(
            parentData.wallet,
            depth + 1,
            visited
          );
          if (parentNode) {
            node.children.push(parentNode); // Add the parent as a child (reverse tree structure)
          }
        }
      }

      return node;
    };

    // Start building the referral tree from the given wallet
    const rootNode = await buildReferralTree(wallet, 0, new Set<string>());

    // If no data is found for the wallet, throw an error
    if (!rootNode) {
      throw new Error(`No referral data found for wallet: ${wallet}`);
    }

    return rootNode;
  },
  async getParentReferralsFromExistingData(
    userData: UserData,
    allUsersData: UserData[]
  ): Promise<Referral> {
    const buildReferralTree = async (
      userData: UserData,
      depth: number,
      visited: Set<string>
    ): Promise<Referral | null> => {
      // Prevent infinite loops by keeping track of visited nodes
      if (visited.has(userData.wallet)) {
        return null;
      }
      visited.add(userData.wallet);

      // Create the node for this user
      const node: Referral = {
        data: userData,
        level: depth,
        children: [],
      };

      // If the depth is less than 9, try to go to the parent by the `by` field
      if (depth < 9 && userData.by) {
        const parentsData = allUsersData.filter(
          (user) => user.code === userData.by
        );

        for (const parentData of parentsData) {
          // Recursively build the parent node
          const parentNode: Referral | null = await buildReferralTree(
            parentData,
            depth + 1,
            visited
          );
          if (parentNode) {
            node.children.push(parentNode); // Add the parent as a child (reverse tree structure)
          }
        }
      }

      return node;
    };

    // Start building the referral tree from the given userData
    const rootNode = await buildReferralTree(userData, 0, new Set<string>());

    // If no data is found for the userData, throw an error
    if (!rootNode) {
      throw new Error(`No referral data found for wallet: ${userData.wallet}`);
    }

    return rootNode;
  },
  async getTopReferralCount(wallet: string): Promise<number> {
    const userDoc = await getDoc(doc(this.usersCollection, wallet));
    const userData = userDoc.data() as UserData;

    if (!userData?.code) {
      return 0;
    }

    const invitedUsersQuery = query(
      this.usersCollection,
      where("by", "==", userData.code)
    );
    const invitedUsersSnapshot = await getDocs(invitedUsersQuery);
    return invitedUsersSnapshot.docs.length;
  },
  async getReferralCount(wallet: string): Promise<number> {
    const allUsersSnapshot = await getDocs(this.usersCollection);
    const userDataMap = new Map<string, UserData>();

    // Populate the map with all user data
    allUsersSnapshot.docs.forEach((doc) => {
      const data = doc.data() as UserData;
      userDataMap.set(doc.id, data);
    });

    const countReferrals = (
      userId: string,
      depth: number,
      visited: Set<string>
    ): number => {
      if (visited.has(userId) || depth >= 10) return 0;

      visited.add(userId);

      const userData = userDataMap.get(userId);
      if (!userData) return 0;

      let count = 0;
      if (userData.code) {
        // Find users who were invited by the current user
        const invitedUsers = Array.from(userDataMap.entries())
          .filter(([, data]) => data.by === userData.code)
          .map(([id]) => id);

        count += invitedUsers.length;

        for (const invitedUserId of invitedUsers) {
          count += countReferrals(invitedUserId, depth + 1, visited);
        }
      }

      return count;
    };

    return countReferrals(wallet, 0, new Set<string>());
  },

  async getTeamStakes(by: string): Promise<{ bnb: number; usdt: number }> {
    const invitedUsersQuery = query(
      this.usersCollection,
      where("by", "==", by)
    );

    const invitedUsersSnapshot = await getDocs(invitedUsersQuery);
    let totalUSDTStakes = 0;
    let totalBNBStakes = 0;
    for (const doc of invitedUsersSnapshot.docs) {
      const childRefData = doc.data() as UserData;
      totalUSDTStakes += childRefData.groupUSDTStakes ?? 0;
      totalBNBStakes += childRefData.groupBNBStakes ?? 0;
    }

    return {
      bnb: totalBNBStakes,
      usdt: totalUSDTStakes,
    };
  },
  async getReferralDataWithCount(
    wallet: string
  ): Promise<{ name: string; count: number }> {
    // Fetch all users once and create a user data map
    const allUsersSnapshot = await getDocs(this.usersCollection);
    const userDataMap: Map<string, UserData> = new Map();

    allUsersSnapshot.docs.forEach((doc) => {
      const data = doc.data() as UserData;
      userDataMap.set(doc.id, data);
    });

    const countReferrals = async (
      userId: string,
      depth: number,
      visited: Set<string>
    ): Promise<number> => {
      if (visited.has(userId) || depth >= 10) return 0;

      visited.add(userId);

      const userData = userDataMap.get(userId);
      if (!userData) return 0;

      let count = 0;
      if (userData.code) {
        const invitedUsers = Array.from(userDataMap.entries())
          .filter(([, data]) => data.by === userData.code)
          .map(([id]) => id);

        count += invitedUsers.length;

        for (const invitedUserId of invitedUsers) {
          count += await countReferrals(invitedUserId, depth + 1, visited);
        }
      }

      return count;
    };

    const me = userDataMap.get(wallet);
    if (!me) {
      throw new Error("User not found");
    }

    const count = await countReferrals(wallet, 0, new Set<string>());
    return { name: me.name || "No Name", count };
  },
  async updateReferralCount(wallet: string): Promise<number> {
    const usersRef = collection(db, "users");

    // Fetch all users in a single query instead of loading entire collection into memory
    const allUsersSnapshot = await getDocs(
      query(usersRef, where("by", "!=", null))
    );

    const userDataMap = new Map<string, UserData>();
    const usersByReferralCode = new Map<string, string[]>();

    // Single pass to build both maps
    allUsersSnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      userDataMap.set(doc.id, userData);

      if (userData.by) {
        const referrers = usersByReferralCode.get(userData.by) || [];
        referrers.push(doc.id);
        usersByReferralCode.set(userData.by, referrers);
      }
    });

    const countReferrals = (
      userId: string,
      depth: number,
      visited: Set<string>
    ): number => {
      if (visited.has(userId) || depth >= 10) return 0;
      visited.add(userId);

      const invitedUsers =
        usersByReferralCode.get(userDataMap.get(userId)?.code || "") || [];

      let count = invitedUsers.length;
      for (const invitedUserId of invitedUsers) {
        count += countReferrals(invitedUserId, depth + 1, visited);
      }

      return count;
    };

    const me = userDataMap.get(wallet);
    if (!me) throw new Error("User not found");

    const count = countReferrals(wallet, 0, new Set<string>());
    // Avoid unnecessary writes
    if (me.referralCount !== count) {
      await updateDoc(doc(db, "users", wallet), { count });
    }
    return count;
  },

  async getPerLevelReferrals(
    referrals: Referral[]
  ): Promise<Record<number, number>> {
    const levelCounts: Record<number, number> = {};

    referrals.forEach((referral) => {
      const level = referral.level;
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    return levelCounts;
  },
};
