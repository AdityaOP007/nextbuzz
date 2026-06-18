import { Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/prisma";
import { AuthRequest } from "../types";
import { formatEventDate, formatEventTime } from "../utils";
import { CreateEventInput } from "../validators";

function serializeEvent(event: {
  id: string;
  title: string;
  description: string | null;
  category: string;
  city: string;
  venue: string;
  latitude: Decimal | null;
  longitude: Decimal | null;
  eventDate: Date;
  eventTime: Date;
  price: Decimal;
  capacity: number;
  availableSeats: number;
  imageUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const price = Number(event.price);
  const sold = event.availableSeats <= 0;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    city: event.city,
    venue: event.venue,
    latitude: event.latitude ? Number(event.latitude) : null,
    longitude: event.longitude ? Number(event.longitude) : null,
    date: formatEventDate(event.eventDate),
    time: formatEventTime(event.eventTime),
    eventDate: event.eventDate.toISOString().split("T")[0],
    eventTime: event.eventTime.toISOString().split("T")[1]?.slice(0, 8),
    price,
    capacity: event.capacity,
    availableSeats: event.availableSeats,
    imageUrl: event.imageUrl,
    img: event.imageUrl,
    featured: event.featured,
    sold,
    attendees: ["A", "S", "R"],
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export async function getEvents(req: AuthRequest, res: Response): Promise<void> {
  const { category, city, search, featured } = req.query;

  const events = await prisma.event.findMany({
    where: {
      ...(category && { category: String(category) }),
      ...(city && { city: String(city) }),
      ...(featured === "true" && { featured: true }),
      ...(search && {
        OR: [
          { title: { contains: String(search), mode: "insensitive" } },
          { venue: { contains: String(search), mode: "insensitive" } },
          { category: { contains: String(search), mode: "insensitive" } },
        ],
      }),
    },
    orderBy: [{ featured: "desc" }, { eventDate: "asc" }],
  });

  res.json({
    success: true,
    data: events.map(serializeEvent),
  });
}

export async function getEventById(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }

  res.json({ success: true, data: serializeEvent(event) });
}

export async function createEvent(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body as CreateEventInput;

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      venue: data.venue,
      latitude: data.latitude,
      longitude: data.longitude,
      eventDate: new Date(data.eventDate),
      eventTime: new Date(`1970-01-01T${data.eventTime}`),
      price: data.price,
      capacity: data.capacity,
      availableSeats: data.availableSeats ?? data.capacity,
      imageUrl: data.imageUrl,
      featured: data.featured ?? false,
    },
  });

  res.status(201).json({
    success: true,
    data: serializeEvent(event),
    message: "Event created successfully",
  });
}

export async function updateEvent(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const data = req.body as Partial<CreateEventInput>;

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.venue !== undefined && { venue: data.venue }),
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.eventDate !== undefined && { eventDate: new Date(data.eventDate) }),
      ...(data.eventTime !== undefined && {
        eventTime: new Date(`1970-01-01T${data.eventTime}`),
      }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.availableSeats !== undefined && { availableSeats: data.availableSeats }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.featured !== undefined && { featured: data.featured }),
    },
  });

  res.json({
    success: true,
    data: serializeEvent(event),
    message: "Event updated successfully",
  });
}

export async function deleteEvent(req: AuthRequest, res: Response): Promise<void> {
  const id = String(req.params.id);
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: "Event not found" });
    return;
  }

  await prisma.event.delete({ where: { id } });
  res.json({ success: true, message: "Event deleted successfully" });
}
