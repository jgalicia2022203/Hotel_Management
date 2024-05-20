// src/database/seed.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Amenity from "../src/amenities/amenity.model.js";
import Booking from "../src/bookings/booking.model.js";
import Event from "../src/events/event.model.js";
import Hotel from "../src/hotels/hotel.model.js";
import Invoice from "../src/invoices/invoice.model.js";
import Room from "../src/rooms/room.model.js";
import Service from "../src/services/service.model.js";
import User from "../src/users/user.model.js";

export const seedDatabase = async () => {
  try {
    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const users = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109ca"),
          name: "Admin",
          username: "Admin",
          email: "admin@outlook.es",
          password: await bcrypt.hash("123456", 10),
          role: "ADMIN",
          phoneNumber: "1234567890",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109cb"),
          name: "AdminHotel",
          username: "AdminHotel",
          email: "adminHotel@outlook.es",
          password: await bcrypt.hash("123456", 10),
          role: "ADMIN_HOTEL",
          phoneNumber: "1234567891",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109cc"),
          name: "Client",
          username: "client",
          email: "client@outlook.es",
          password: await bcrypt.hash("123456", 10),
          role: "CLIENT",
          phoneNumber: "1234567892",
        },
      ];
      await User.insertMany(users);
      console.log("Users have been seeded successfully.");
    }

    // Seed Amenities
    const amenityCount = await Amenity.countDocuments();
    if (amenityCount === 0) {
      const amenities = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109cd"),
          description: "Free Wi-Fi",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109ce"),
          description: "Swimming Pool",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109cf"),
          description: "Gym",
        },
      ];
      await Amenity.insertMany(amenities);
      console.log("Amenities have been seeded successfully.");
    }

    // Seed Hotels
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      const hotels = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d0"),
          name: "Barcelo",
          description: "A luxury hotel",
          address: "123 Main St",
          phone: "1234567890",
          email: "contact@barcelo.com",
          category: "five-star",
          amenities: [
            "60d0fe4f5311236168a109cd",
            "60d0fe4f5311236168a109ce",
            "60d0fe4f5311236168a109cf",
          ],
          rooms: [
            "60d0fe4f5311236168a109d3",
            "60d0fe4f5311236168a109d4",
            "60d0fe4f5311236168a109d5",
          ],
          images: ["image1.jpg", "image2.jpg", "image3.jpg"],
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d1"),
          name: "Holiday Inn.",
          description: "A budget hotel",
          address: "456 Elm St",
          phone: "1234567891",
          email: "contact@holydayinn.com",
          category: "three-star",
          amenities: ["60d0fe4f5311236168a109cd"],
          rooms: [
            "60d0fe4f5311236168a109d6",
            "60d0fe4f5311236168a109d7",
            "60d0fe4f5311236168a109d8",
          ],
          images: ["image1.jpg", "image2.jpg", "image3.jpg"],
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d2"),
          name: "Hilton",
          description: "A business hotel",
          address: "789 Pine St",
          phone: "1234567892",
          email: "contact@hilton.com",
          category: "four-star",
          amenities: [
            "60d0fe4f5311236168a109cd",
            "60d0fe4f5311236168a109ce",
            "60d0fe4f5311236168a109cf",
          ],
          rooms: ["60d0fe4f5311236168a109d9"],
          images: ["image1.jpg", "image2.jpg", "image3.jpg"],
        },
      ];
      await Hotel.insertMany(hotels);
      console.log("Hotels have been seeded successfully.");
    }

    // Seed Rooms
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      const rooms = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d3"),
          room_number: "101",
          type: "Single",
          capacity: 1,
          price_per_night: 100,
          hotel: "60d0fe4f5311236168a109d0",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d4"),
          room_number: "102",
          type: "Double",
          capacity: 2,
          price_per_night: 150,
          hotel: "60d0fe4f5311236168a109d0",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d5"),
          room_number: "103",
          type: "Suite",
          capacity: 4,
          price_per_night: 300,
          hotel: "60d0fe4f5311236168a109d0",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d6"),
          room_number: "101",
          type: "Single",
          capacity: 1,
          price_per_night: 100,
          hotel: "60d0fe4f5311236168a109d1",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d7"),
          room_number: "102",
          type: "Double",
          capacity: 2,
          price_per_night: 150,
          hotel: "60d0fe4f5311236168a109d1",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d8"),
          room_number: "103",
          type: "Suite",
          capacity: 4,
          price_per_night: 300,
          hotel: "60d0fe4f5311236168a109d1",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d9"),
          room_number: "101",
          type: "Single",
          capacity: 1,
          price_per_night: 100,
          hotel: "60d0fe4f5311236168a109d2",
        },
      ];
      await Room.insertMany(rooms);
      console.log("Rooms have been seeded successfully.");
    }

    // Seed Bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      const bookings = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d6"),
          user: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d3",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          status: "confirmed",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d7"),
          user: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d4",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
          status: "confirmed",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d8"),
          user: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d5",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
          status: "confirmed",
        },
      ];
      await Booking.insertMany(bookings);
      console.log("Bookings have been seeded successfully.");
    }

    // Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const services = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109d9"),
          name: "Room Service",
          description: "24/7 room service",
          available: true,
          price: 50,
          hotel: "60d0fe4f5311236168a109d0",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109da"),
          name: "Spa",
          description: "Relaxing spa services",
          available: true,
          price: 100,
          hotel: "60d0fe4f5311236168a109d0",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109db"),
          name: "Gym Access",
          description: "Access to the hotel gym",
          available: true,
          price: 20,
          hotel: "60d0fe4f5311236168a109d0",
        },
      ];
      await Service.insertMany(services);
      console.log("Services have been seeded successfully.");
    }

    // Seed Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const events = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109dc"),
          name: "Conference",
          description: "Business conference",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          hotel: "60d0fe4f5311236168a109d0",
          status: "scheduled",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109dd"),
          name: "Wedding",
          description: "Wedding event",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
          hotel: "60d0fe4f5311236168a109d0",
          status: "scheduled",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109de"),
          name: "Concert",
          description: "Live music concert",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
          hotel: "60d0fe4f5311236168a109d0",
          status: "scheduled",
        },
      ];
      await Event.insertMany(events);
      console.log("Events have been seeded successfully.");
    }

    // Seed Invoices
    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0) {
      const invoices = [
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109df"),
          guest: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d3",
          services: [],
          total: 100,
          additional_charges: 0,
          discounts: 0,
          issuedDate: new Date(),
          status: "paid",
          payment_method: "Credit Card",
          invoice_number: "INV001",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109e0"),
          guest: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d3",
          services: [],
          total: 200,
          additional_charges: 0,
          discounts: 0,
          issuedDate: new Date(),
          status: "paid",
          payment_method: "Credit Card",
          invoice_number: "INV002",
        },
        {
          _id: new mongoose.Types.ObjectId("60d0fe4f5311236168a109e1"),
          guest: "60d0fe4f5311236168a109cc",
          hotel: "60d0fe4f5311236168a109d0",
          room: "60d0fe4f5311236168a109d3",
          services: [],
          total: 300,
          additional_charges: 0,
          discounts: 0,
          issuedDate: new Date(),
          status: "paid",
          payment_method: "Credit Card",
          invoice_number: "INV003",
        },
      ];
      await Invoice.insertMany(invoices);
      console.log("Invoices have been seeded successfully.");
    }

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
