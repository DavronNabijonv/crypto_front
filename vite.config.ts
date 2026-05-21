import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    obfuscatorPlugin({
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        stringArray: true,
        stringArrayEncoding: ["rc4"],
        stringArrayRotate: true,
        selfDefending: true,
        debugProtection: false,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        identifierNamesGenerator: "hexadecimal",
      },
    }),
  ],
  server: {
    proxy: {
      "/encrypt": "http://localhost:8000",
      "/decrypt": "http://localhost:8000",
      "/share": "http://localhost:8000",
    },
  },
});
