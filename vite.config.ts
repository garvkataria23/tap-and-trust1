import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: "/",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	  plugins: [
	    react(),
	    cloudflare({
	      // auxiliaryWorkers: [{ configPath: "/mocha/emails-service/wrangler.json" }],
	    }),
	  ],
	  server: {
	    allowedHosts: true,
	    proxy: {
	      '/api': {
	        target: 'http://localhost:5000',
	        changeOrigin: true,
	      },
	    },
	  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
