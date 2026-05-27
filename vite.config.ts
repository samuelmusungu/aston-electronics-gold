import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Keep the bundled Start server pointed at the local SSR error wrapper.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
