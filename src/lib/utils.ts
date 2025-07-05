import { clsx, type ClassValue } from "clsx";
import { verify } from "jsonwebtoken";
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

export function verifyToken(token: string, handle: string) {
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { handle: string };
      if (decoded.handle !== handle) {
        return { error: 'Handle mismatch' };
      }
    } catch (err) {
      return { error: 'Invalid token' };
    }
  } else {
    return { error: 'No token provided' };
  }
  return { error: '' };
}