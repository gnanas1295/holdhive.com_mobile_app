import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    bookingId: v.id("bookings"),
    spaceId: v.id("spaces"),
    reviewerId: v.id("users"),
    revieweeId: v.id("users"),
    rating: v.number(),
    comment: v.optional(v.string()),
    reviewType: v.union(v.literal("space"), v.literal("renter")),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      createdAt: new Date().toISOString(),
    });

    // Update space rating if it's a space review
    if (args.reviewType === "space") {
      const spaceReviews = await ctx.db
        .query("reviews")
        .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
        .filter((q) => q.eq(q.field("reviewType"), "space"))
        .collect();

      const totalRating = spaceReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / spaceReviews.length;

      await ctx.db.patch(args.spaceId, {
        rating: averageRating,
        totalReviews: spaceReviews.length,
      });
    }

    // Update user rating
    const userReviews = await ctx.db
      .query("reviews")
      .withIndex("by_reviewee", (q) => q.eq("revieweeId", args.revieweeId))
      .collect();

    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / userReviews.length;

    await ctx.db.patch(args.revieweeId, {
      rating: averageRating,
      totalReviews: userReviews.length,
    });

    return reviewId;
  },
});

export const getBySpace = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_space", (q) => q.eq("spaceId", args.spaceId))
      .filter((q) => q.eq(q.field("reviewType"), "space"))
      .collect();

    const reviewsWithReviewers = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await ctx.db.get(review.reviewerId);
        return {
          ...review,
          reviewer: reviewer ? {
            name: reviewer.name,
            profileImage: reviewer.profileImage,
          } : null,
        };
      })
    );

    return reviewsWithReviewers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_reviewee", (q) => q.eq("revieweeId", args.userId))
      .collect();

    const reviewsWithDetails = await Promise.all(
      reviews.map(async (review) => {
        const reviewer = await ctx.db.get(review.reviewerId);
        const space = review.reviewType === "space" ? await ctx.db.get(review.spaceId) : null;
        
        return {
          ...review,
          reviewer: reviewer ? {
            name: reviewer.name,
            profileImage: reviewer.profileImage,
          } : null,
          space: space ? {
            title: space.title,
          } : null,
        };
      })
    );

    return reviewsWithDetails.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});