import { Response } from "express";
import { prisma } from "../db/prisma";
import { AuthRequest } from "../types";
import { formatEventDate, formatEventTime } from "../utils";

function serializeCartItem(item: {
  id: string;
  event: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    city: string;
    venue: string;
    eventDate: Date;
    eventTime: Date;
    price: import("@prisma/client/runtime/library").Decimal;
    availableSeats: number;
    imageUrl: string | null;
    featured: boolean;
  };
}) {
  const ev = item.event;
  return {
    id: ev.id,
    title: ev.title,
    description: ev.description,
    category: ev.category,
    city: ev.city,
    venue: ev.venue,
    date: formatEventDate(ev.eventDate),
    time: formatEventTime(ev.eventTime),
    price: Number(ev.price),
    availableSeats: ev.availableSeats,
    imageUrl: ev.imageUrl,
    img: ev.imageUrl,
    featured: ev.featured,
    sold: ev.availableSeats <= 0,
    attendees: ["A", "S", "R"],
  };
}

export async function getCart(req: AuthRequest, res: Response): Promise<void> {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user!.userId },
    include: { event: true },
  });
  res.json({ success: true, data: items.map(serializeCartItem) });
}

export async function syncCart(req: AuthRequest, res: Response): Promise<void> {
  const { eventIds } = req.body as { eventIds: string[] };
  const userId = req.user!.userId;

  await prisma.cartItem.deleteMany({ where: { userId } });

  if (eventIds?.length) {
    await prisma.cartItem.createMany({
      data: eventIds.map((eventId) => ({ userId, eventId })),
      skipDuplicates: true,
    });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { event: true },
  });
  res.json({ success: true, data: items.map(serializeCartItem) });
}

export async function addToCart(req: AuthRequest, res: Response): Promise<void> {
  console.log("POST /api/cart/:eventId — Request Body:", req.body, "Params:", req.params);
  const eventId = String(req.params.eventId);
  const userId = req.user!.userId;

  console.log("Adding to cart:", { userId, eventId });
  const cartItem = await prisma.cartItem.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId },
    update: {},
  });
  console.log("Cart item created/updated:", cartItem);

  res.json({ success: true, message: "Added to cart", data: cartItem });
}

export async function removeFromCart(req: AuthRequest, res: Response): Promise<void> {
  console.log("DELETE /api/cart/:eventId — Params:", req.params);
  const eventId = String(req.params.eventId);
  const userId = req.user!.userId;

  console.log("Removing from cart:", { userId, eventId });
  const result = await prisma.cartItem.deleteMany({
    where: { userId, eventId },
  });
  console.log("Cart items removed:", result.count);

  res.json({ success: true, message: "Removed from cart" });
}
