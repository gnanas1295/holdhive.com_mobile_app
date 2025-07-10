import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchSpaces = query({
  args: {
    query: v.string(),
    filters: v.optional(v.object({
      city: v.optional(v.string()),
      maxPrice: v.optional(v.number()),
      minPrice: v.optional(v.number()),
      spaceType: v.optional(v.string()),
      amenities: v.optional(v.array(v.string())),
      minSize: v.optional(v.number()),
      maxSize: v.optional(v.number()),
    })),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let spaces = await ctx.db
      .query("spaces")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();

    // Text search in title and description
    if (args.query.trim()) {
      const searchTerm = args.query.toLowerCase();
      spaces = spaces.filter(space => 
        space.title.toLowerCase().includes(searchTerm) ||
        space.description.toLowerCase().includes(searchTerm) ||
        space.city.toLowerCase().includes(searchTerm) ||
        space.address.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (args.filters) {
      const { city, maxPrice, minPrice, spaceType, amenities, minSize, maxSize } = args.filters;
      
      if (city) {
        spaces = spaces.filter(space => 
          space.city.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      if (maxPrice !== undefined) {
        spaces = spaces.filter(space => space.pricePerMonth <= maxPrice);
      }
      
      if (minPrice !== undefined) {
        spaces = spaces.filter(space => space.pricePerMonth >= minPrice);
      }
      
      if (spaceType && spaceType !== "all") {
        spaces = spaces.filter(space => space.spaceType === spaceType);
      }
      
      if (amenities && amenities.length > 0) {
        spaces = spaces.filter(space => 
          amenities.some(amenity => space.amenities.includes(amenity))
        );
      }
    }

    // Limit results
    if (args.limit) {
      spaces = spaces.slice(0, args.limit);
    }

    // Get owner details for each space
    const spacesWithOwners = await Promise.all(
      spaces.map(async (space) => {
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

export const getPopularSpaces = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const spaces = await ctx.db
      .query("spaces")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();

    // Sort by rating and total reviews
    const sortedSpaces = spaces
      .filter(space => (space.rating || 0) > 0)
      .sort((a, b) => {
        const aScore = (a.rating || 0) * (a.totalReviews || 0);
        const bScore = (b.rating || 0) * (b.totalReviews || 0);
        return bScore - aScore;
      });

    const limitedSpaces = args.limit ? sortedSpaces.slice(0, args.limit) : sortedSpaces;

    // Get owner details
    const spacesWithOwners = await Promise.all(
      limitedSpaces.map(async (space) => {
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

export const getNearbySpaces = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radiusKm: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const spaces = await ctx.db
      .query("spaces")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();

    const radiusKm = args.radiusKm || 10; // Default 10km radius

    // Filter spaces within radius (simple distance calculation)
    const nearbySpaces = spaces.filter(space => {
      if (!space.latitude || !space.longitude) return false;
      
      const distance = calculateDistance(
        args.latitude,
        args.longitude,
        space.latitude,
        space.longitude
      );
      
      return distance <= radiusKm;
    });

    // Sort by distance
    const sortedSpaces = nearbySpaces
      .map(space => ({
        ...space,
        distance: calculateDistance(
          args.latitude,
          args.longitude,
          space.latitude!,
          space.longitude!
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    const limitedSpaces = args.limit ? sortedSpaces.slice(0, args.limit) : sortedSpaces;

    // Get owner details
    const spacesWithOwners = await Promise.all(
      limitedSpaces.map(async (space) => {
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

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}