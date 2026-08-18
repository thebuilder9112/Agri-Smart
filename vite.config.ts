import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, Plugin } from "vite";
import express from "express";
import { apiRouter } from "./server/apiRouter.js";

function expressApiPlugin(): Plugin {
  return {
    name: "vite-express-api-plugin",
    configureServer(server) {
      const app = express();
      app.use(express.json({ limit: "25mb" }));
      app.use(express.urlencoded({ extended: true, limit: "25mb" }));
      app.use("/api", apiRouter);

      server.middlewares.use(app);
    },
  };
}

export default defineConfig(() => {
  return {
    base: "./",
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
