import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "@/config";
import sensible from "@/core/plugins/sensible";
import errorHandler from "@/core/plugins/errorHandler";
import authPlugin from "@/core/plugins/auth";
import multipart from "@fastify/multipart";

import { registerModules } from "@/modules/register";

import { prisma } from "@/core/database/prisma";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || "super-secret",
  });

  // Security plugins
  await app.register(helmet);
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  // Custom plugins
  await app.register(sensible);
  await app.register(errorHandler);
  await app.register(authPlugin);

  await app.register(multipart);

  // Register all modules
  await registerModules(app);

  app.get("/", async () => {
    return {
      message: "Inventory ERP API Running",
    };
  });

  // Graceful shutdown
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
