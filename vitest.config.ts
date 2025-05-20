import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/test-utils.ts",
    testTimeout: 10000, // 10 seconds
  },
});
