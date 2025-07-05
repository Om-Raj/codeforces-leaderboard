import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function capitalize(str: string) {
  if (!str) return '';
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

export function capitalizeWords(str: string) {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

