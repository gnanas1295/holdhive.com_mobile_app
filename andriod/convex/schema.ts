import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    profileImage: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    totalReviews: v.optional(v.number()),
    isVerified: v.optional(v.boolean()),
    bio: v.optional(v.string()),
    joinedDate: v.optional(v.string()),
    preferences: v.optional(v.object({
      notifications: v.optional(v.object({
        email: v.optional(v.boolean()),
        push: v.optional(v.boolean()),
        sms: v.optional(v.boolean()),
      })),
      language: v.optional(v.string()),
      currency: v.optional(v.string()),
    })),
  }).index("by_email", ["email"]),

  spaces: defineTable({
    title: v.string(),
    description: v.string(),
    address: v.string(),
    city: v.string(),
    pricePerMonth: v.number(),
    spaceType: v.union(
      v.literal("room"),
      v.literal("garage"),
      v.literal("basement"),
      v.literal("attic"),
      v.literal("storage_unit"),
      v.literal("other")
    ),
    size: v.string(), // e.g., "10x10 feet", "Small", "Medium", "Large"
    sizeInSqFt: v.optional(v.number()), // Numeric size for filtering
    amenities: v.array(v.string()), // ["climate_controlled", "24_7_access", "security", "parking"]
    images: v.array(v.id("_storage")),
    ownerId: v.id("users"),
    isAvailable: v.boolean(),
    minimumRentalPeriod: v.number(), // in months
    accessHours: v.string(), // e.g., "24/7", "9AM-6PM", "By appointment"
    securityFeatures: v.array(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    rating: v.optional(v.number()),
    totalReviews: v.optional(v.number()),
    isApproved: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
    viewCount: v.optional(v.number()),
    favoriteCount: v.optional(v.number()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_city", ["city"])
    .index("by_availability", ["isAvailable"])
    .index("by_price", ["pricePerMonth"])
    .index("by_space_type", ["spaceType"])
    .index("by_rating", ["rating"]),

  bookings: defineTable({
    spaceId: v.id("spaces"),
    renterId: v.id("users"),
    ownerId: v.id("users"),
    startDate: v.string(),
    endDate: v.string(),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded"),
      v.literal("failed")
    ),
    specialInstructions: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()), // For Stripe integration
  })
    .index("by_space", ["spaceId"])
    .index("by_renter", ["renterId"])
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_payment_status", ["paymentStatus"]),

  reviews: defineTable({
    bookingId: v.id("bookings"),
    spaceId: v.id("spaces"),
    reviewerId: v.id("users"),
    revieweeId: v.id("users"), // space owner
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
    reviewType: v.union(v.literal("space"), v.literal("renter")),
    createdAt: v.string(),
    isVerified: v.optional(v.boolean()),
    helpfulCount: v.optional(v.number()),
  })
    .index("by_space", ["spaceId"])
    .index("by_reviewee", ["revieweeId"])
    .index("by_booking", ["bookingId"])
    .index("by_reviewer", ["reviewerId"]),

  messages: defineTable({
    bookingId: v.id("bookings"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    timestamp: v.string(),
    isRead: v.boolean(),
    messageType: v.optional(v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("system")
    )),
    attachments: v.optional(v.array(v.id("_storage"))),
  })
    .index("by_booking", ["bookingId"])
    .index("by_receiver", ["receiverId"])
    .index("by_sender", ["senderId"]),

  notifications: defineTable({
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
    isRead: v.boolean(),
    createdAt: v.string(),
    relatedId: v.optional(v.string()),
    data: v.optional(v.object({
      bookingId: v.optional(v.id("bookings")),
      spaceId: v.optional(v.id("spaces")),
      messageId: v.optional(v.id("messages")),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"]),

  favorites: defineTable({
    userId: v.id("users"),
    spaceId: v.id("spaces"),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_user_and_space", ["userId", "spaceId"]),

  reports: defineTable({
    reporterId: v.id("users"),
    reportedUserId: v.optional(v.id("users")),
    reportedSpaceId: v.optional(v.id("spaces")),
    reportedBookingId: v.optional(v.id("bookings")),
    reason: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("investigating"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    createdAt: v.string(),
    resolvedAt: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
  })
    .index("by_reporter", ["reporterId"])
    .index("by_status", ["status"]),
});