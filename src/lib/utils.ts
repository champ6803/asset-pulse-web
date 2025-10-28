import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("THB", "฿");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format expire date to short format (e.g., "Dec 2024")
 */
export function formatExpireDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  return dayjs(dateStr).format("MMM YYYY");
}

/**
 * Check if a license is expiring soon (within the next 30 days)
 */
export function isExpiringSoon(
  expireDate?: string,
  daysThreshold: number = 30
): boolean {
  if (!expireDate) return false;
  const expiryDate = dayjs(expireDate);
  const now = dayjs();
  const thresholdDate = now.add(daysThreshold, "day");

  return expiryDate.isAfter(now) && expiryDate.isBefore(thresholdDate);
}

/**
 * Check if a license is expired
 */
export function isExpired(expireDate?: string): boolean {
  if (!expireDate) return false;
  return dayjs(expireDate).isBefore(dayjs());
}
