import { query } from "./_generated/server";
import { v } from "convex/values";

export const getOwnerAnalytics = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all spaces owned by the user
    const spaces = await ctx.db
      .query("spaces")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    // Get all bookings for these spaces
    const allBookings = await Promise.all(
      spaces.map(space =>
        ctx.db
          .query("bookings")
          .withIndex("by_space", (q) => q.eq("spaceId", space._id))
          .collect()
      )
    );

    const bookings = allBookings.flat();

    // Calculate metrics
    const totalSpaces = spaces.length;
    const availableSpaces = spaces.filter(s => s.isAvailable).length;
    const occupiedSpaces = totalSpaces - availableSpaces;

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === "active").length;
    const completedBookings = bookings.filter(b => b.status === "completed").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;

    // Calculate earnings
    const totalEarnings = bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const monthlyEarnings = bookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear() &&
               b.paymentStatus === "paid";
      })
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Calculate average rating
    const spacesWithRatings = spaces.filter(s => s.rating && s.rating > 0);
    const averageRating = spacesWithRatings.length > 0
      ? spacesWithRatings.reduce((sum, s) => sum + (s.rating || 0), 0) / spacesWithRatings.length
      : 0;

    // Monthly booking trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      });
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bookings: monthBookings.length,
        earnings: monthBookings
          .filter(b => b.paymentStatus === "paid")
          .reduce((sum, b) => sum + b.totalAmount, 0),
      });
    }

    return {
      overview: {
        totalSpaces,
        availableSpaces,
        occupiedSpaces,
        totalBookings,
        activeBookings,
        completedBookings,
        pendingBookings,
        totalEarnings,
        monthlyEarnings,
        averageRating,
      },
      trends: monthlyTrends,
      topPerformingSpaces: spaces
        .filter(s => s.rating && s.rating > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5)
        .map(s => ({
          id: s._id,
          title: s.title,
          rating: s.rating || 0,
          totalReviews: s.totalReviews || 0,
          monthlyEarnings: bookings
            .filter(b => {
              const bookingDate = new Date(b.createdAt);
              const now = new Date();
              return b.spaceId === s._id &&
                     bookingDate.getMonth() === now.getMonth() && 
                     bookingDate.getFullYear() === now.getFullYear() &&
                     b.paymentStatus === "paid";
            })
            .reduce((sum, b) => sum + b.totalAmount, 0),
        })),
    };
  },
});

export const getPlatformAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const spaces = await ctx.db.query("spaces").collect();
    const users = await ctx.db.query("users").collect();
    const bookings = await ctx.db.query("bookings").collect();
    const reviews = await ctx.db.query("reviews").collect();

    const totalSpaces = spaces.length;
    const availableSpaces = spaces.filter(s => s.isAvailable).length;
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const totalReviews = reviews.length;

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // City distribution
    const cityDistribution = spaces.reduce((acc, space) => {
      acc[space.city] = (acc[space.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Space type distribution
    const spaceTypeDistribution = spaces.reduce((acc, space) => {
      acc[space.spaceType] = (acc[space.spaceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      overview: {
        totalSpaces,
        availableSpaces,
        totalUsers,
        totalBookings,
        totalReviews,
        totalRevenue,
        averageSpaceRating: spaces
          .filter(s => s.rating && s.rating > 0)
          .reduce((sum, s, _, arr) => sum + (s.rating || 0) / arr.length, 0),
      },
      distributions: {
        cities: Object.entries(cityDistribution)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count),
        spaceTypes: Object.entries(spaceTypeDistribution)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count),
      },
    };
  },
});