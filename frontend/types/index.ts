export interface User {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  city?: string | null;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  city: string;
  venue: string;
  latitude?: number | null;
  longitude?: number | null;
  date: string;
  time: string;
  eventDate?: string;
  eventTime?: string;
  price: number;
  capacity: number;
  availableSeats: number;
  imageUrl?: string | null;
  img?: string | null;
  featured: boolean;
  sold?: boolean;
  attendees?: string[];
}

export interface CartItem extends Event {
  qty?: number;
}

export interface Booking {
  id: string;
  ticketId?: string;
  userId: string;
  eventId: string;
  quantity: number;
  ticketType: string;
  totalPrice: number;
  bookingStatus: string;
  createdAt: string;
  event?: Partial<Event>;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  ticketType: string;
}

export interface LastBooking extends BookingFormData {
  ticketId: string;
  total: string;
  ev: Event;
}

export type TicketType = "General Admission" | "VIP" | "Early Bird";

export const CATEGORIES = [
  { id: "", label: "All Events", icon: "🌟" },
  { id: "Music", label: "Music", icon: "🎵" },
  { id: "Food", label: "Food & Drink", icon: "🍜" },
  { id: "Tech", label: "Tech", icon: "💻" },
  { id: "Fitness", label: "Fitness", icon: "🧘" },
  { id: "Arts", label: "Arts", icon: "🎨" },
  { id: "Comedy", label: "Comedy", icon: "😂" },
] as const;

export const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune",
] as const;

export const CONVENIENCE_FEE = 49;

export const AVATAR_COLORS = [
  "var(--orange)",
  "var(--rose)",
  "var(--purple)",
  "var(--teal)",
  "var(--gold)",
];

export const FALLBACK_IMAGES: Record<string, string> = {
  Music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
  Food: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  Tech: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  Fitness: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  Arts: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&q=80",
  Comedy: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
};
