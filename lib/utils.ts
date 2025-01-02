import { APYS } from "@/config/apys";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeStampToDate(timestamp: number): Date {
  return new Date(timestamp);
}

export function dayDifference(date1: Date, date2: Date): number {
  // Convert both dates to milliseconds
  const date1Millis = date1.getTime();
  const date2Millis = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMillis = Math.abs(date1Millis - date2Millis);

  // Convert milliseconds to days
  const differenceDays = differenceMillis / (1000 * 60 * 60 * 24);

  // Return the difference in days
  return Math.floor(differenceDays);
}

// Calculate total APY based on daily rate and duration
export const calculateTotalAPYForAStake = (
  duration: StakeDuration,
  amount: number
) => {
  return (APYS[duration] / 100) * amount * duration;
};
