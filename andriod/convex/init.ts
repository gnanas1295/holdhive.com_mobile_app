import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const initializeApp = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Data already initialized", userId: existingUsers[0]._id };
    }

    // Create a demo user first
    const demoUserId = await ctx.db.insert("users", {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+353 87 123 4567",
      rating: 4.8,
      totalReviews: 24,
      isVerified: true,
      bio: "Friendly host with secure storage spaces in Dublin",
      joinedDate: "2023-01-15",
    });

    // Create another user for variety
    const user2Id = await ctx.db.insert("users", {
      name: "Sarah O'Connor",
      email: "sarah.oconnor@example.com",
      phone: "+353 86 987 6543",
      rating: 4.9,
      totalReviews: 18,
      isVerified: true,
      bio: "Professional storage host with climate-controlled spaces",
      joinedDate: "2023-03-20",
    });

    // Create a renter user
    const renterId = await ctx.db.insert("users", {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+353 85 555 1234",
      rating: 4.7,
      totalReviews: 12,
      isVerified: true,
      bio: "Reliable renter, always takes good care of spaces",
      joinedDate: "2023-06-10",
    });

    // Create demo spaces using the real user IDs
    const space1Id = await ctx.db.insert("spaces", {
      title: "Spacious Garage Storage in Dublin City Center",
      description: "Clean, dry garage space perfect for storing furniture, boxes, and personal items. Easy access with parking available. Located in a safe residential area with good security.",
      address: "15 Grafton Street",
      city: "Dublin",
      pricePerMonth: 150,
      spaceType: "garage",
      size: "12x8 feet",
      amenities: ["24_7_access", "security", "parking", "easy_access"],
      images: [],
      ownerId: demoUserId,
      isAvailable: true,
      minimumRentalPeriod: 1,
      accessHours: "24/7",
      securityFeatures: ["secure_lock", "lighting", "cctv"],
      rating: 4.8,
      totalReviews: 12,
      isApproved: true,
      createdAt: "2024-01-15T10:00:00Z",
      viewCount: 45,
      favoriteCount: 8,
    });

    const space2Id = await ctx.db.insert("spaces", {
      title: "Climate Controlled Storage Room",
      description: "Temperature and humidity controlled storage room ideal for sensitive items, documents, electronics, and artwork. Professional storage facility with excellent security.",
      address: "22 Temple Bar",
      city: "Dublin",
      pricePerMonth: 200,
      spaceType: "storage_unit",
      size: "10x10 feet",
      amenities: ["climate_controlled", "security", "24_7_access", "electricity"],
      images: [],
      ownerId: demoUserId,
      isAvailable: true,
      minimumRentalPeriod: 2,
      accessHours: "24/7",
      securityFeatures: ["cctv", "secure_lock", "alarm_system", "keypad_access"],
      rating: 4.9,
      totalReviews: 8,
      isApproved: true,
      createdAt: "2024-02-01T14:30:00Z",
      viewCount: 32,
      favoriteCount: 12,
    });

    const space3Id = await ctx.db.insert("spaces", {
      title: "Basement Storage in Quiet Neighborhood",
      description: "Dry basement storage space in a quiet residential area. Perfect for long-term storage of household items, seasonal decorations, and sports equipment.",
      address: "8 Merrion Square",
      city: "Dublin",
      pricePerMonth: 120,
      spaceType: "basement",
      size: "8x12 feet",
      amenities: ["security", "easy_access"],
      images: [],
      ownerId: user2Id,
      isAvailable: true,
      minimumRentalPeriod: 1,
      accessHours: "9AM-8PM",
      securityFeatures: ["secure_lock", "lighting"],
      rating: 4.6,
      totalReviews: 5,
      isApproved: true,
      createdAt: "2024-02-15T09:15:00Z",
      viewCount: 28,
      favoriteCount: 6,
    });

    const space4Id = await ctx.db.insert("spaces", {
      title: "Attic Space for Light Storage",
      description: "Clean attic space suitable for storing lightweight items like clothes, books, and documents. Easy ladder access and good ventilation.",
      address: "45 St. Stephen's Green",
      city: "Dublin",
      pricePerMonth: 80,
      spaceType: "attic",
      size: "6x10 feet",
      amenities: ["easy_access"],
      images: [],
      ownerId: user2Id,
      isAvailable: false,
      minimumRentalPeriod: 1,
      accessHours: "By appointment",
      securityFeatures: ["secure_lock"],
      rating: 4.4,
      totalReviews: 3,
      isApproved: true,
      createdAt: "2024-03-01T16:45:00Z",
      viewCount: 15,
      favoriteCount: 3,
    });

    // Create some bookings
    const booking1Id = await ctx.db.insert("bookings", {
      spaceId: space4Id,
      renterId: renterId,
      ownerId: user2Id,
      startDate: "2024-03-15",
      endDate: "2024-06-15",
      totalAmount: 240,
      status: "active",
      paymentStatus: "paid",
      specialInstructions: "Will store mainly books and winter clothes",
      createdAt: "2024-03-10T12:00:00Z",
    });

    const booking2Id = await ctx.db.insert("bookings", {
      spaceId: space1Id,
      renterId: renterId,
      ownerId: demoUserId,
      startDate: "2024-02-01",
      endDate: "2024-04-01",
      totalAmount: 300,
      status: "completed",
      paymentStatus: "paid",
      specialInstructions: "Storing furniture during apartment renovation",
      createdAt: "2024-01-25T10:30:00Z",
    });

    // Create some reviews
    await ctx.db.insert("reviews", {
      bookingId: booking2Id,
      spaceId: space1Id,
      reviewerId: renterId,
      revieweeId: demoUserId,
      rating: 5,
      comment: "Excellent storage space! Very clean and secure. John was very helpful and responsive.",
      reviewType: "space",
      createdAt: "2024-04-05T14:20:00Z",
      isVerified: true,
      helpfulCount: 3,
    });

    await ctx.db.insert("reviews", {
      bookingId: booking2Id,
      spaceId: space1Id,
      reviewerId: demoUserId,
      revieweeId: renterId,
      rating: 5,
      comment: "Mike was a great renter. Very respectful and left the space clean.",
      reviewType: "renter",
      createdAt: "2024-04-06T09:15:00Z",
      isVerified: true,
      helpfulCount: 1,
    });

    // Create some messages
    await ctx.db.insert("messages", {
      bookingId: booking1Id,
      senderId: renterId,
      receiverId: user2Id,
      content: "Hi Sarah, I'll be dropping off my items this weekend. What time works best?",
      timestamp: "2024-03-12T15:30:00Z",
      isRead: true,
      messageType: "text",
    });

    await ctx.db.insert("messages", {
      bookingId: booking1Id,
      senderId: user2Id,
      receiverId: renterId,
      content: "Hi Mike! Saturday afternoon between 2-5 PM would be perfect. I'll be around to help if needed.",
      timestamp: "2024-03-12T16:45:00Z",
      isRead: true,
      messageType: "text",
    });

    // Create some notifications
    await ctx.db.insert("notifications", {
      userId: demoUserId,
      title: "New Booking Request",
      message: "You have a new booking request for your garage storage space",
      type: "booking_request",
      isRead: false,
      createdAt: "2024-03-20T10:00:00Z",
      data: {
        spaceId: space1Id,
      },
    });

    await ctx.db.insert("notifications", {
      userId: renterId,
      title: "Booking Confirmed",
      message: "Your booking for the attic storage space has been confirmed",
      type: "booking_confirmed",
      isRead: true,
      createdAt: "2024-03-10T14:30:00Z",
      data: {
        bookingId: booking1Id,
        spaceId: space4Id,
      },
    });

    return { 
      message: "App initialized successfully with demo data",
      userId: demoUserId,
      totalSpaces: 4,
      totalUsers: 3,
      totalBookings: 2
    };
  },
});

export const getCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    // For demo purposes, return the first user as the "current user"
    const users = await ctx.db.query("users").collect();
    if (users.length > 0) {
      return users[0];
    }
    
    // If no users exist, create one
    const userId = await ctx.db.insert("users", {
      name: "Demo User",
      email: "demo@holdhive.com",
      phone: "+353 87 123 4567",
      rating: 0,
      totalReviews: 0,
      isVerified: false,
      joinedDate: new Date().toISOString(),
    });
    
    return await ctx.db.get(userId);
  },
});