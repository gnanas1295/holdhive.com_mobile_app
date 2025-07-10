import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("booking_request"),
      v.literal("booking_confirmed"),
      v.literal("booking_cancelled"),
      v.literal("payment_received"),
      v.literal("review_received"),
      v.literal("message_received"),
      v.literal("space_approved"),
      v.literal("general")
    ),
    relatedId: v.optional(v.string()), // booking ID, space ID, etc.
    data: v.optional(v.object({
      bookingId: v.optional(v.id("bookings")),
      spaceId: v.optional(v.id("spaces")),
      messageId: v.optional(v.id("messages")),
    })),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return notificationId;
  },
});

export const getUserNotifications = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    const notifications = await query.collect();

    let filteredNotifications = notifications;
    
    if (args.unreadOnly) {
      filteredNotifications = notifications.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply limit
    if (args.limit) {
      filteredNotifications = filteredNotifications.slice(0, args.limit);
    }

    return filteredNotifications;
  },
});

export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    await Promise.all(
      notifications.map(notification =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unreadNotifications.length;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
  },
});