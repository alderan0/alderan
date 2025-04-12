import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 */
export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return options?.addSuffix ? 'less than a minute ago' : 'less than a minute';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return options?.addSuffix 
      ? `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
      : `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return options?.addSuffix
      ? `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
      : `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return options?.addSuffix
      ? `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
      : `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return options?.addSuffix
      ? `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
      : `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return options?.addSuffix
    ? `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
    : `${diffInYears} year${diffInYears !== 1 ? 's' : ''}`;
}
