import { clsx, type ClassValue } from "clsx";
import { verify } from "jsonwebtoken";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (!str) return "";
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function verifyToken(token: string, handle: string) {
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        handle: string;
      };
      if (decoded.handle !== handle) {
        return { error: "Handle mismatch" };
      }
    } catch (err) {
      return { error: "Invalid token" };
    }
  } else {
    return { error: "No token provided" };
  }
  return { error: "" };
}

// Function to get the appropriate class for a Codeforces rank
export function getRankColorClass(rank: string): string {
  const normalizedRank = rank?.toLowerCase() || "";

  if (normalizedRank.includes("newbie")) {
    return "text-newbie";
  } else if (normalizedRank.includes("pupil")) {
    return "text-pupil";
  } else if (normalizedRank.includes("specialist")) {
    return "text-specialist";
  } else if (normalizedRank.includes("expert")) {
    return "text-expert";
  } else if (normalizedRank.includes("candidate master")) {
    return "text-candidate-master";
  } else if (normalizedRank.includes("master")) {
    return "text-master";
  } else if (normalizedRank.includes("grandmaster")) {
    return "text-grandmaster";
  } else if (normalizedRank.includes("international")) {
    return "text-international-master";
  } else {
    return "";
  }
}

// Function to get the appropriate class for a Codeforces rating
export function getRatingColorClass(rating: number): string {
  if (rating < 1200) {
    return "text-newbie"; // Newbie
  } else if (rating < 1400) {
    return "text-pupil"; // Pupil
  } else if (rating < 1600) {
    return "text-specialist"; // Specialist
  } else if (rating < 1900) {
    return "text-expert"; // Expert
  } else if (rating < 2100) {
    return "text-candidate-master"; // Candidate Master
  } else if (rating < 2400) {
    return "text-master"; // Master
  } else if (rating < 2600) {
    return "text-international-master"; // International Master
  } else {
    return "text-grandmaster"; // Grandmaster
  }
}
