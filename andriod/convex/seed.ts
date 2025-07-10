import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data first
    const existingSpaces = await ctx.db.query("spaces").collect();
    const existingUsers = await ctx.db.query("users").collect();
    const existingBookings = await ctx.db.query("bookings").collect();
    
    // Delete existing data
    for (const space of existingSpaces) {
      await ctx.db.delete(space._id);
    }
    for (const user of existingUsers) {
      await ctx.db.delete(user._id);
    }
    for (const booking of existingBookings) {
      await ctx.db.delete(booking._id);
    }

    // Create sample users
    const user1 = await ctx.db.insert("users", {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+353 87 123 4567",
      rating: 4.8,
      totalReviews: 24,
      isVerified: true,
      joinedDate: "2023-06-15",
    });

    const user2 = await ctx.db.insert("users", {
      name: "Michael O'Connor",
      email: "michael@example.com", 
      phone: "+353 86 987 6543",
      rating: 4.9,
      totalReviews: 18,
      isVerified: true,
      joinedDate: "2023-08-20",
    });

    const user3 = await ctx.db.insert("users", {
      name: "Emma Walsh",
      email: "emma@example.com",
      phone: "+353 85 456 7890",
      rating: 4.7,
      totalReviews: 12,
      isVerified: false,
      joinedDate: "2023-09-10",
    });

    const user4 = await ctx.db.insert("users", {
      name: "James Murphy",
      email: "james@example.com",
      phone: "+353 83 234 5678",
      rating: 4.6,
      totalReviews: 8,
      isVerified: true,
      joinedDate: "2023-10-05",
    });

    // Create sample spaces
    const space1 = await ctx.db.insert("spaces", {
      title: "Spacious Garage Storage in City Center",
      description: "Clean, dry garage space perfect for storing furniture, boxes, and personal items. Easy access with parking available. Located in a safe residential area with 24/7 security cameras.",
      address: "123 Grafton Street",
      city: "Dublin",
      pricePerMonth: 150,
      spaceType: "garage",
      size: "Large (20x15 ft)",
      sizeInSqFt: 300,
      amenities: ["24_7_access", "security", "parking", "electricity"],
      images: [],
      ownerId: user1,
      isAvailable: true,
      minimumRentalPeriod: 1,
      accessHours: "24/7",
      securityFeatures: ["cctv", "secure_lock", "lighting"],
      latitude: 53.3441,
      longitude: -6.2675,
      rating: 4.8,
      totalReviews: 12,
      isApproved: true,
      createdAt: "2024-01-01T10:00:00Z",
      viewCount: 45,
      favoriteCount: 8,
    });

    const space2 = await ctx.db.insert("spaces", {
      title: "Clean Basement Room Near University",
      description: "Dry basement storage room ideal for students. Climate controlled environment perfect for books, electronics, and clothing. Very close to Trinity College and UCD.",
      address: "456 Dame Street",
      city: "Dublin",
      pricePerMonth: 100,
      spaceType: "basement",
      size: "Medium (12x10 ft)",
      sizeInSqFt: 120,
      amenities: ["climate_controlled", "security", "easy_access"],
      images: [],
      ownerId: user2,
      isAvailable: true,
      minimumRentalPeriod: 1,
      accessHours: "9AM-8PM",
      securityFeatures: ["secure_lock", "lighting"],
      latitude: 53.3435,
      longitude: -6.2674,
      rating: 5.0,
      totalReviews: 8,
      isApproved: true,
      createdAt: "2024-01-05T14:30:00Z",
      viewCount: 32,
      favoriteCount: 12,
    });

    const space3 = await ctx.db.insert("spaces", {
      title: "Attic Storage in Quiet Neighborhood",
      description: "Spacious attic storage in a quiet residential area. Perfect for long-term storage of seasonal items, furniture, and personal belongings. Easy access via pull-down ladder.",
      address: "789 Merrion Square",
      city: "Dublin",
      pricePerMonth: 80,
      spaceType: "attic",
      size: "Large (15x12 ft)",
      sizeInSqFt: 180,
      amenities: ["quiet_area", "easy_access"],
      images: [],
      ownerId: user3,
      isAvailable: true,
      minimumRentalPeriod: 2,
      accessHours: "By appointment",
      securityFeatures: ["secure_lock"],
      latitude: 53.3398,
      longitude: -6.2497,
      rating: 4.5,
      totalReviews: 6,
      isApproved: true,
      createdAt: "2024-01-10T09:15:00Z",
      viewCount: 28,
      favoriteCount: 5,
    });

    const space4 = await ctx.db.insert("spaces", {
      title: "Modern Storage Unit with Premium Access",
      description: "Professional storage unit with keypad access and climate control. Perfect for business documents, valuable items, and furniture. Located in a modern facility with excellent security.",
      address: "321 O'Connell Street",
      city: "Cork",
      pricePerMonth: 200,
      spaceType: "storage_unit",
      size: "Large (16x20 ft)",
      sizeInSqFt: 320,
      amenities: ["climate_controlled", "24_7_access", "security", "keypad_access"],
      images: [],
      ownerId: user1,
      isAvailable: false,
      minimumRentalPeriod: 3,
      accessHours: "24/7",
      securityFeatures: ["cctv", "keypad_access", "alarm_system", "lighting"],
      latitude: 51.8985,
      longitude: -8.4756,
      rating: 4.9,
      totalReviews: 15,
      isApproved: true,
      createdAt: "2024-01-15T16:45:00Z",
      viewCount: 67,
      favoriteCount: 18,
    });

    const space5 = await ctx.db.insert("spaces", {
      title: "Spare Room for Student Storage",
      description: "Clean spare room in family home, perfect for students going home for holidays. Safe neighborhood, friendly hosts, and flexible access arrangements.",
      address: "654 Patrick Street",
      city: "Cork",
      pricePerMonth: 120,
      spaceType: "room",
      size: "Medium (10x12 ft)",
      sizeInSqFt: 120,
      amenities: ["friendly_hosts", "flexible_access", "safe_area"],
      images: [],
      ownerId: user2,
      isAvailable: true,
      minimumRentalPeriod: 1,
      accessHours: "9AM-6PM",
      securityFeatures: ["secure_lock"],
      latitude: 51.8979,
      longitude: -8.4751,
      rating: 4.6,
      totalReviews: 9,
      isApproved: true,
      createdAt: "2024-01-20T11:20:00Z",
      viewCount: 41,
      favoriteCount: 7,
    });

    const space6 = await ctx.db.insert("spaces", {
      title: "Secure Warehouse Space",
      description: "Large warehouse space with excellent security. Perfect for businesses or individuals needing substantial storage. Loading dock available.",
      address: "890 Industrial Estate",
      city: "Galway",
      pricePerMonth: 300,
      spaceType: "storage_unit",
      size: "Extra Large (25x30 ft)",
      sizeInSqFt: 750,
      amenities: ["loading_dock", "24_7_access", "security", "large_space"],
      images: [],
      ownerId: user4,
      isAvailable: true,
      minimumRentalPeriod: 6,
      accessHours: "24/7",
      securityFeatures: ["cctv", "alarm_system", "security_guard", "lighting"],
      latitude: 53.2707,
      longitude: -9.0568,
      rating: 4.7,
      totalReviews: 11,
      isApproved: true,
      createdAt: "2024-01-25T13:10:00Z",
      viewCount: 23,
      favoriteCount: 4,
    });

    // Create sample bookings
    const booking1 = await ctx.db.insert("bookings", {
      spaceId: space1,
      renterId: user3,
      ownerId: user1,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      totalAmount: 450,
      status: "active",
      paymentStatus: "paid",
      createdAt: "2024-01-10T10:00:00Z",
      specialInstructions: "Will need access on weekends for moving items",
    });

    const booking2 = await ctx.db.insert("bookings", {
      spaceId: space2,
      renterId: user4,
      ownerId: user2,
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      totalAmount: 300,
      status: "pending",
      paymentStatus: "pending",
      createdAt: "2024-01-20T14:30:00Z",
      specialInstructions: "Student storage for semester break",
    });

    const booking3 = await ctx.db.insert("bookings", {
      spaceId: space4,
      renterId: user3,
      ownerId: user1,
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      totalAmount: 1000,
      status: "active",
      paymentStatus: "paid",
      createdAt: "2023-12-25T09:15:00Z",
      specialInstructions: "Business documents storage",
    });

    // Create sample reviews
    await ctx.db.insert("reviews", {
      bookingId: booking1,
      spaceId: space1,
      reviewerId: user3,
      revieweeId: user1,
      rating: 5,
      comment: "Excellent space! Very clean and secure. Sarah was very helpful and responsive.",
      reviewType: "space",
      createdAt: "2024-01-20T15:30:00Z",
      isVerified: true,
      helpfulCount: 3,
    });

    await ctx.db.insert("reviews", {
      bookingId: booking1,
      spaceId: space1,
      reviewerId: user4,
      revieweeId: user1,
      rating: 4,
      comment: "Great location and easy access. Would recommend!",
      reviewType: "space",
      createdAt: "2024-01-18T12:45:00Z",
      isVerified: true,
      helpfulCount: 2,
    });

    return { 
      message: "Sample data created successfully!",
      users: 4,
      spaces: 6,
      bookings: 3,
      reviews: 2
    };
  },
});

export const clearData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear all data
    const spaces = await ctx.db.query("spaces").collect();
    const users = await ctx.db.query("users").collect();
    const bookings = await ctx.db.query("bookings").collect();
    const reviews = await ctx.db.query("reviews").collect();
    
    for (const space of spaces) await ctx.db.delete(space._id);
    for (const user of users) await ctx.db.delete(user._id);
    for (const booking of bookings) await ctx.db.delete(booking._id);
    for (const review of reviews) await ctx.db.delete(review._id);
    
    return { message: "All data cleared successfully!" };
  },
});