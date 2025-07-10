import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    const favoriteId = await ctx.db.insert("favorites", {
      ...args,
      createdAt: new Date().toISOString(),
    });

    // Update space favorite count
    const space = await ctx.db.get(args.spaceId);
    if (space) {
      await ctx.db.patch(args.spaceId, {
        favoriteCount: (space.favoriteCount || 0) + 1,
      });
    }

    return favoriteId;
  },
});

export const remove = mutation({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .unique();

    if (favorite) {
      await ctx.db.delete(favorite._id);

      // Update space favorite count
      const space = await ctx.db.get(args.spaceId);
      if (space && (space.favoriteCount || 0) > 0) {
        await ctx.db.patch(args.spaceId, {
          favoriteCount: (space.favoriteCount || 0) - 1,
        });
      }
    }
  },
});

export const getUserFavorites = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const spacesWithDetails = await Promise.all(
      favorites.map(async (favorite) => {
        const space = await ctx.db.get(favorite.spaceId);
        if (!space) return null;

        const owner = await ctx.db.get(space.ownerId);
        return {
          ...space,
          favoriteId: favorite._id,
          favoritedAt: favorite.createdAt,
          owner: owner ? {
            name: owner.name,
            rating: owner.rating || 0,
            totalReviews: owner.totalReviews || 0,
            isVerified: owner.isVerified || false,
          } : null,
        };
      })
    );

    return spacesWithDetails
      .filter(space => space !== null)
      .sort((a, b) => new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime());
  },
});

export const isFavorited = query({
  args: {
    userId: v.id("users"),
    spaceId: v.id("spaces"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_space", (q) => 
        q.eq("userId", args.userId).eq("spaceId", args.spaceId)
      )
      .unique();

    return !!favorite;
  },
});

export const getSpaceFavoriteCount = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .collect();

    return favorites.length;
  },
});