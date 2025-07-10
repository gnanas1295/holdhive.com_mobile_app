import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    spaceId: v.id("spaces"),
    renterId: v.id("users"),
    startDate: v.string(),
    endDate: v.string(),
    totalAmount: v.number(),
    specialInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const space = await ctx.db.get(args.spaceId);
    if (!space) throw new Error("Space not found");

    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      ownerId: space.ownerId,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return bookingId;
  },
});

export const getMyBookings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_renter", (q) => q.eq("renterId", args.userId))
      .collect();

    const bookingsWithSpaces = await Promise.all(
      bookings.map(async (booking) => {
        const space = await ctx.db.get(booking.spaceId);
        const owner = space ? await ctx.db.get(space.ownerId) : null;
        
        return {
          ...booking,
          space: space ? {
            title: space.title,
            address: space.address,
            city: space.city,
            images: space.images,
          } : null,
          owner: owner ? {
            name: owner.name,
            phone: owner.phone,
          } : null,
        };
      })
    );

    return bookingsWithSpaces.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const getOwnerBookings = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const space = await ctx.db.get(booking.spaceId);
        const renter = await ctx.db.get(booking.renterId);
        
        return {
          ...booking,
          space: space ? {
            title: space.title,
            address: space.address,
            city: space.city,
          } : null,
          renter: renter ? {
            name: renter.name,
            phone: renter.phone,
            email: renter.email,
          } : null,
        };
      })
    );

    return bookingsWithDetails.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      status: args.status,
    });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      paymentStatus: args.paymentStatus,
    });
  },
});