import api from "@/lib/api";
import { Event } from "@/types";

interface CartResponse {
  success: boolean;
  data: Event[];
}

export const cartService = {
  async getCart() {
    const res = await api.get<CartResponse>("/cart");
    return res.data;
  },

  async syncCart(eventIds: string[]) {
    const res = await api.put<CartResponse>("/cart/sync", { eventIds });
    return res.data;
  },

  async addToCart(eventId: string) {
    console.log("Submitting:", { eventId });
    const res = await api.post(`/cart/${eventId}`);
    return res.data;
  },

  async removeFromCart(eventId: string) {
    console.log("Submitting:", { eventId });
    const res = await api.delete(`/cart/${eventId}`);
    return res.data;
  },
};
