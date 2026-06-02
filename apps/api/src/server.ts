import "dotenv/config";
import { buildApp } from "@/app/app";

const start = async () => {
  const app = await buildApp();
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0",
    });
    const address = app.server.address();
    if (typeof address === "object" && address) {
      app.log.info(`Server running on http://localhost:${address.port}`);
      //  app.log.info(`Server running on ${app.server.address()}`);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
