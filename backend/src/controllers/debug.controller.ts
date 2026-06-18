import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function getDbStatus(_req: Request, res: Response): Promise<void> {
  try {
    const dbResult = await prisma.$queryRaw<Array<{ current_database: string }>>`
      SELECT current_database()
    `;
    const database = dbResult[0]?.current_database ?? "unknown";

    const [users, events, bookings, cartItems] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.booking.count(),
      prisma.cartItem.count(),
    ]);

    res.json({
      connected: true,
      database,
      users,
      events,
      bookings,
      cartItems,
    });
  } catch (error) {
    console.error("DB status check failed:", error);
    res.status(500).json({
      connected: false,
      database: null,
      users: 0,
      events: 0,
      bookings: 0,
      cartItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
