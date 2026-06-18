import api from "@/lib/api";
import { Booking, TicketType } from "@/types";

interface BookingsResponse {
  success: boolean;
  data: Booking[];
}

interface BookingResponse {
  success: boolean;
  data: Booking;
  message?: string;
  error?: string;
}

export const bookingService = {
  async createBooking(data: {
    eventId: string;
    quantity: number;
    ticketType: TicketType;
  }) {
    console.log("Submitting:", data);
    const res = await api.post<BookingResponse>("/bookings", data);
    return res.data;
  },

  async getUserBookings() {
    const res = await api.get<BookingsResponse>("/bookings/user");
    return res.data;
  },

  async getBookingById(id: string) {
    const res = await api.get<BookingResponse>(`/bookings/${id}`);
    return res.data;
  },
};
