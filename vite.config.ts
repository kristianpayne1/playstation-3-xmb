import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/PlayStation-3-XMB/",
    plugins: [react(), glsl(), tailwindcss()],
    build: {
        chunkSizeWarningLimit: 3000,
    },
    assetsInclude: ["**/*.glb", "**/*.ttf"],
});
