import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    city: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    spaceType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("spaces").withIndex("by_availability", (q) =>
      q.eq("isAvailable", true)
    );

    const spaces = await query.collect();

    // Filter by city if provided
    let filteredSpaces = spaces;
    if (args.city) {
      filteredSpaces = filteredSpaces.filter(space => 
        space.city.toLowerCase().includes(args.city!.toLowerCase())
      );
    }

    // Filter by max price if provided
    if (args.maxPrice) {
      filteredSpaces = filteredSpaces.filter(space => 
        space.pricePerMonth <= args.maxPrice!
      );
    }

    // Filter by space type if provided
    if (args.spaceType && args.spaceType !== "all") {
      filteredSpaces = filteredSpaces.filter(space => 
        space.spaceType === args.spaceType
      );
    }

    // Get owner details for each space
    const spacesWithOwners = await Promise.all(
      filteredSpaces.map(async (space) => {
        const owner = await ctx.db.get(space.ownerId);
        return {
          ...space,
          owner: owner ? {
            name: owner.name,
            rating: owner.rating || 0,
            totalReviews: owner.totalReviews || 0,
            isVerified: owner.isVerified || false,
          } : null,
        };
      })
    );

    return spacesWithOwners;
  },
});

export const getById = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const space = await ctx.db.get(args.id);
    if (!space) return null;

    const owner = await ctx.db.get(space.ownerId);
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_space", (q) => q.eq("spaceId", args.id))
      .collect();

    return {
      ...space,
      owner: owner ? {
        name: owner.name,
        rating: owner.rating || 0,
        totalReviews: owner.totalReviews || 0,
        isVerified: owner.isVerified || false,
        profileImage: owner.profileImage,
      } : null,
      reviews,
    };
  },
});

export const create = mutation({
  args: {
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
    size: v.string(),
    amenities: v.array(v.string()),
    images: v.array(v.id("_storage")),
    ownerId: v.id("users"),
    minimumRentalPeriod: v.number(),
    accessHours: v.string(),
    securityFeatures: v.array(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const spaceId = await ctx.db.insert("spaces", {
      ...args,
      isAvailable: true,
      rating: 0,
      totalReviews: 0,
    });
    return spaceId;
  },
});

export const getMySpaces = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const spaces = await ctx.db
      .query("spaces")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    // Get booking counts for each space
    const spacesWithBookings = await Promise.all(
      spaces.map(async (space) => {
        const bookings = await ctx.db
          .query("bookings")
          .withIndex("by_space", (q) => q.eq("spaceId", space._id))
          .collect();
        
        const activeBookings = bookings.filter(b => b.status === "active").length;
        const totalBookings = bookings.length;

        return {
          ...space,
          activeBookings,
          totalBookings,
        };
      })
    );

    return spacesWithBookings;
  },
});

export const updateAvailability = mutation({
  args: {
    spaceId: v.id("spaces"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.spaceId, {
      isAvailable: args.isAvailable,
    });
  },
});