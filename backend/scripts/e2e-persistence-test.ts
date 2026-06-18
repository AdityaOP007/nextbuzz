/**
 * End-to-end persistence test — run while backend is up:
 *   npx tsx scripts/e2e-persistence-test.ts
 */
import { PrismaClient } from "@prisma/client";

const API = process.env.API_URL || "http://localhost:4000/api";
const prisma = new PrismaClient({ log: ["error"] });

async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${JSON.stringify(body)}`);
  }
  return body as T;
}

async function main() {
  console.log("\n=== NextBuzz E2E Persistence Test ===\n");

  const dbBefore = await prisma.$queryRaw<Array<{ current_database: string }>>`
    SELECT current_database()
  `;
  console.log("1. Database:", dbBefore[0].current_database);

  const statusBefore = await api<{
    connected: boolean;
    database: string;
    users: number;
    events: number;
    bookings: number;
    cartItems: number;
  }>("/debug/db-status");
  console.log("2. DB status before:", statusBefore);

  const testEmail = `test-${Date.now()}@nextbuzz.in`;
  const registerPayload = {
    firstName: "Test",
    lastName: "User",
    email: testEmail,
    phone: "+91 99999 00001",
    city: "Bengaluru",
    password: "TestPass1",
  };
  console.log("3. Registering user:", testEmail);
  const registerRes = await api<{
    success: boolean;
    data: { token: string; user: { id: string; email: string } };
  }>("/auth/register", { method: "POST", body: JSON.stringify(registerPayload) });
  const token = registerRes.data.token;
  console.log("   User created:", registerRes.data.user);

  const eventsRes = await api<{ success: boolean; data: Array<{ id: string; title: string }> }>(
    "/events"
  );
  const event = eventsRes.data.find((e) => e.title.includes("TechSpark")) || eventsRes.data[2];
  console.log("4. Booking event:", event.title);

  const bookingPayload = {
    eventId: event.id,
    quantity: 1,
    ticketType: "General Admission",
  };
  const bookingRes = await api<{
    success: boolean;
    data: { id: string; eventId: string; quantity: number };
  }>("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(bookingPayload),
  });
  console.log("5. Booking created:", bookingRes.data);

  const cartEvent =
    eventsRes.data.find((e) => e.title.includes("Yoga")) || eventsRes.data[3];
  console.log("6. Adding to cart:", cartEvent.title);
  const cartRes = await api<{ success: boolean; data: { id: string; eventId: string } }>(
    `/cart/${cartEvent.id}`,
    { method: "POST", token }
  );
  console.log("   Cart item:", cartRes.data);

  const profilePayload = { city: "Mumbai", phone: "+91 88888 77777" };
  console.log("7. Updating profile...");
  await api("/auth/profile", {
    method: "PUT",
    token,
    body: JSON.stringify(profilePayload),
  });

  const statusAfter = await api<{
    connected: boolean;
    database: string;
    users: number;
    events: number;
    bookings: number;
    cartItems: number;
  }>("/debug/db-status");
  console.log("8. DB status after:", statusAfter);

  const user = await prisma.user.findUnique({ where: { email: testEmail } });
  const booking = await prisma.booking.findFirst({
    where: { userId: user!.id },
    include: { event: true },
  });
  const cartItem = await prisma.cartItem.findFirst({
    where: { userId: user!.id },
    include: { event: true },
  });

  console.log("\n=== PROOF ===");
  console.log("Database:", dbBefore[0].current_database);
  console.log("Sample user:", { id: user?.id, email: user?.email, city: user?.city });
  console.log("Sample booking:", {
    id: booking?.id,
    event: booking?.event.title,
    quantity: booking?.quantity,
  });
  console.log("Sample cart item:", {
    id: cartItem?.id,
    event: cartItem?.event.title,
  });
  console.log("Table counts:", {
    users: statusAfter.users,
    events: statusAfter.events,
    bookings: statusAfter.bookings,
    cartItems: statusAfter.cartItems,
  });

  const passed =
    user &&
    booking &&
    cartItem &&
    statusAfter.users > statusBefore.users &&
    statusAfter.bookings > statusBefore.bookings &&
    statusAfter.cartItems > statusBefore.cartItems;

  console.log(passed ? "\n✅ ALL PERSISTENCE TESTS PASSED\n" : "\n❌ TESTS FAILED\n");
  process.exit(passed ? 0 : 1);
}

main()
  .catch((e) => {
    console.error("E2E test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
