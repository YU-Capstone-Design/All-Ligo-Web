import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "All-Ligo-Web",
        short_name: "All-Ligo",
        description: "All-Ligo Web App",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
});
