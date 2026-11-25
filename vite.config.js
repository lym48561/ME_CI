import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],

  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        working_hour: resolve(process.cwd(), "src/pages/working_hour.html"),
      },
    },
  },
});
