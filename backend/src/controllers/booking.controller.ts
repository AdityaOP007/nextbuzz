import { Response } from "express";
import { prisma } from "../db/prisma";
import { AuthRequest } from "../types";
import { generateBookingId } from "../utils";
import { CreateBookingInput } from "../validators";

const CONVENIENCE_FEE = 49;

function serializeBooking(booking: {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  ticketType: string;
  totalPrice: import("@prisma/client/runtime/library").Decimal;
  bookingStatus: string;
  createdAt: Date;
  event?: {
    id: string;
    title: string;
    venue: string;
    city: string;
    eventDate: Date;
    eventTime: Date;
    imageUrl: string | null;
    price: import("@prisma/client/runtime/library").Decimal;
  };
}) {
  return {
    id: booking.id,
    ticketId: generateBookingId(),
    userId: booking.userId,
    eventId: booking.eventId,
    quantity: booking.quantity,
    ticketType: booking.ticketType,
    totalPrice: Number(booking.totalPrice),
    bookingStatus: booking.bookingStatus,
    createdAt: booking.createdAt,
    event: booking.event
      ? {
          id: booking.event.id,
          title: booking.event.title,
          venue: booking.event.venue,
          city: booking.event.city,
          imageUrl: booking.event.imageUrl,
          price: Number(booking.event.price),
        }
      : undefined,
  };
}

export async function createBooking(req: AuthRequest, res: Response): Promise<void> {
  console.log("POST /api/bookings — Request Body:", req.body);
  const data = req.body as CreateBookingInput;
  const userId = req.user!.userId;

  console.log("Looking up event:", data.eventId);
  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }

  if (event.availableSeats < data.quantity) {
    res.status(400).json({ success: false, error: "Not enough seats available" });
    return;
  }

  const basePrice = Number(event.price) * data.quantity;
  const totalPrice = event.price.toNumber() === 0 ? 0 : basePrice + CONVENIENCE_FEE;

  console.log("Creating booking...");
  const [booking] = await prisma.$transaction([
    prisma.booking.create({
      data: {
        userId,
        eventId: data.eventId,
        quantity: data.quantity,
        ticketType: data.ticketType,
        totalPrice,
        bookingStatus: "confirmed",
      },
      include: { event: true },
    }),
    prisma.event.update({
      where: { id: data.eventId },
      data: { availableSeats: { decrement: data.quantity } },
    }),
  ]);
  console.log("Booking created:", {
    id: booking.id,
    userId: booking.userId,
    eventId: booking.eventId,
    quantity: booking.quantity,
  });

  res.status(201).json({
    success: true,
    data: serializeBooking(booking),
    message: "Booking confirmed",
  });
}

export async function getUserBookings(req: AuthRequest, res: Response): Promise<void> {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user!.userId },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    data: bookings.map(serializeBooking),
  });
}

export async function getBookingById(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!booking) {
    res.status(404).json({ success: false, error: "Booking not found" });
    return;
  }

  if (booking.userId !== req.user!.userId) {
    res.status(403).json({ success: false, error: "Access denied" });
    return;
  }

  res.json({ success: true, data: serializeBooking(booking) });
}
