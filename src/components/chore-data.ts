import { choreCategories } from "@/lib/chore-categories";

export type Chore = { id: string; title: string; category: string; neighborhood: string; timing: string; details?: string | null; credits: number; postedBy: string; claimedBy?: string | null; status: string };
export type Member = { id: string; displayName: string; neighborhood: string; credits: number; welcomeGrant: boolean };
export type Event = { id: string; choreId?: string | null; kind: string; amount: number; note: string; createdAt: string };
export type ChoreMessage = { id: string; choreId: string; senderId: string; senderName: string; body: string; createdAt: string };
export const categories = ["All", ...choreCategories];
export const categoryIcons: Record<string, string> = { Cleaning: "✦", Errands: "↗", "Pet & plant care": "♡", "Moving & setup": "□", "Yard care": "⌁", "Computer help": "⌘", "House maintenance": "⌂", "Furniture assembly": "▦", "Painting and decorating": "◒", "Plumbing help": "⌇", "Electrical help": "ϟ", "Appliance help": "◫", "Moving and lifting": "⇅", "Delivery and pickup": "↗", "Grocery shopping": "▤", "Meal preparation": "♨", "Laundry and ironing": "◌", Childcare: "♧", "Elder companionship": "♡", "Tutoring and homework": "✎", "Administrative help": "☷", "Event setup and cleanup": "✧", "Organization and decluttering": "▦", "Recycling and donation drop-off": "♻", "Snow and ice removal": "❄" };
