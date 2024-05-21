"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import amenitiesRoutes from "../src/amenities/amenity.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import bookingRoutes from "../src/bookings/booking.routes.js";
import { errorHandler } from "../src/common/middlewares/error-handler.js";
import apiLimiter from "../src/common/middlewares/validate-amount-petitions.js";
import eventRoutes from "../src/events/event.routes.js";
import hotelRoutes from "../src/hotels/hotel.routes.js";
import invoiceRoutes from "../src/invoices/invoice.routes.js";
import roomRoutes from "../src/rooms/room.routes.js";
import serviceRoutes from "../src/services/service.routes.js";
import userRoutes from "../src/users/user.routes.js";
import reportRoutes from "../src/reports/report.routes.js";

import { seedDatabase } from "./db-data.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.configHelmet();
    this.port = process.env.PORT;
    this.authPath = "/kinalgo/v1/auth";
    this.amenityPath = "/kinalgo/v1/amenities";
    this.eventPath = "/kinalgo/v1/events";
    this.hotelPath = "/kinalgo/v1/hotels";
    this.invoicePath = "/kinalgo/v1/invoices";
    this.roomPath = "/kinalgo/v1/rooms";
    this.servicePath = "/kinalgo/v1/services";
    this.userPath = "/kinalgo/v1/users";
    this.bookingPath = "/kinalgo/v1/bookings";
    this.reportPath = "/kinalgo/v1/reports";
    this.middlewares();
    this.connectDB();
    this.routes();
  }

  configHelmet() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"], // Solo permite fuentes de scripts y otros recursos desde el mismo origen
            scriptSrc: ["'self'", "https://trusted.cdn.com"], // Permite scripts de CDNs confiables
            styleSrc: ["'self'", "https://trusted.cdn.com"], // Permite estilos de CDNs confiables
            imgSrc: ["'self'", "data:", "https://trusted.images.com"], // Permite imágenes del mismo origen y URLs de datos
            connectSrc: ["'self'", "https://api.misitio.com"], // Controla las URL a las que se puede conectar mediante XHR, WebSockets
          },
        },
        frameguard: { action: "deny" }, // Previene clickjacking prohibiendo que el sitio sea puesto en un iframe
        dnsPrefetchControl: { allow: false }, // Controla el DNS prefetching, que puede mejorar la privacidad y la seguridad
        expectCt: { enforce: true, maxAge: 86400 }, // Enforce Certificate Transparency
        referrerPolicy: { policy: "no-referrer" }, // No enviar HTTP Referrer header
      })
    );
  }

  async connectDB() {
    await dbConnection();
    seedDatabase();
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
    this.app.use(this.bookingPath, bookingRoutes);
    this.app.use(this.reportPath, reportRoutes);
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
