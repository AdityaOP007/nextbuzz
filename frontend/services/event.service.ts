import api from "@/lib/api";
import { Event } from "@/types";

interface EventsResponse {
  success: boolean;
  data: Event[];
}

interface EventResponse {
  success: boolean;
  data: Event;
}

export const eventService = {
  async getEvents(params?: {
    category?: string;
    city?: string;
    search?: string;
    featured?: boolean;
  }) {
    try {
      const res = await api.get<EventsResponse>("/events", { params });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error;
    }
  },

  async getEventById(id: string) {
    const res = await api.get<EventResponse>(`/events/${id}`);
    return res.data;
  },
};
