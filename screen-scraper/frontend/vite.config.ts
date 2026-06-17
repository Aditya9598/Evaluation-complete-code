import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target =
    env.VITE_SCRAPER_API_BASE_URL ||
    "https://new-scrapper-provider-dev.internal.production.gm.paytmmoney.com";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/scraper-api": {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/scraper-api/, ""),
          secure: false,
        },
      },
    },
  };
});
