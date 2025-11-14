/**
 * @utility cn
 * @summary Utility function to merge Tailwind CSS classes
 * @category styling
 */

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
