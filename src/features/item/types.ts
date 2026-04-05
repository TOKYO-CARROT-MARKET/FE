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
  created_at: string;
  updated_at: string;
}
