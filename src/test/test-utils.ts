import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { useNavigate } from "react-router-dom";

expect.extend(matchers);
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global mocks
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("gsap", () => ({
  default: { fromTo: vi.fn().mockReturnValue({}) },
  __esModule: true,
}));

export const mockNavigate = vi.fn();

beforeEach(() => {
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
});

// mock the splitText file to prevent the DOM to splitting text on render during test
vi.mock("../Utilities/splitText.js", () => ({
  default: vi.fn(() => ({
    lines: [],
    split: vi.fn(),
  })),
  __esModule: true, // to force ES module compatibility
}));
