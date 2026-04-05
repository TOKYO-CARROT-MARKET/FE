export type ItemStatus = "selling" | "reserved" | "sold";

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  region: string;
  images: string[];
  pickup_type: "pickup" | "delivery" | "both";
  available_from?: string;
  departure_date?: string;
  status: "selling" | "reserved" | "sold";
  views_count: number;
  likes_count: number;
  liked_by_current_user: boolean;
  created_at: string;
  updated_at: string;
  user: { id: number; email: string };
}

export interface ItemFilter {
  q?: string;
  region?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  status?: ItemStatus;
  availableDate?: string;
  limit?: number;
  offset?: number;
}
