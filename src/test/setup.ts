import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { selector } from "gsap";

expect.extend(matchers);
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// mock the splitText file to prevent the DOM to splitting text on render during test
vi.mock("../Utilities/splitText.js", () => ({
  default: vi.fn(() => ({
    lines: [],
    split: vi.fn(),
  })),
  __esModule: true, // Add this to force ES module compatibility
}));
