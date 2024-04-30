"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import amenitiesRoutes from "../src/amenities/amenity.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import apiLimiter from "../src/common/middlewares/validate-amount-petitions.js";
import eventRoutes from "../src/events/event.routes.js";
import hotelRoutes from "../src/hotels/hotel.routes.js";
import invoiceRoutes from "../src/invoices/invoice.routes.js";
import roomRoutes from "../src/rooms/room.routes.js";
import serviceRoutes from "../src/services/service.routes.js";
import User from "../src/users/user.model.js";
import userRoutes from "../src/users/user.routes.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = "/kinalgo/v1/auth";
    this.amenityPath = "/kinalgo/v1/amenities";
    this.eventPath = "/kinalgo/v1/events";
    this.hotelPath = "/kinalgo/v1/hotels";
    this.invoicePath = "/kinalgo/v1/invoices";
    this.roomPath = "/kinalgo/v1/rooms";
    this.servicePath = "/kinalgo/v1/services";
    this.userPath = "/kinalgo/v1/users";
    this.middlewares();
    this.connectDB();
    this.routes();
  }

  async connectDB() {
    await dbConnection();

    const lengthUsers = await User.countDocuments();
    if (lengthUsers > 0) return;

    const adminUser = new User({
      name: "Admin",
      username: "Admin",
      email: "admin@outlook.es",
      password: "123456",
      role: "ADMIN",
    });

    adminUser.save();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(apiLimiter);
  }

  routes() {
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.amenityPath, amenitiesRoutes);
    this.app.use(this.eventPath, eventRoutes);
    this.app.use(this.hotelPath, hotelRoutes);
    this.app.use(this.invoicePath, invoiceRoutes);
    this.app.use(this.roomPath, roomRoutes);
    this.app.use(this.servicePath, serviceRoutes);
    this.app.use(this.userPath, userRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
