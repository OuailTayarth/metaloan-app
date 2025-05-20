import { expect, afterEach, vi, Mock } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { useNavigate } from "react-router-dom";

expect.extend(matchers);
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

export const mockNavigate = vi.fn();

// Global mocks
vi.mock("react-router-dom", async (importOriginal) => {
  // get all react-router-dom
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual, // spread exports: Routes, BrowserRouter,...
    useNavigate: () => mockNavigate,
  };
});

vi.mock("gsap", () => ({
  default: { fromTo: vi.fn().mockReturnValue({}) },
  __esModule: true,
}));

// mock the splitText file to prevent the DOM to splitting text on render during test
vi.mock("../Utilities/splitText.js", () => ({
  default: vi.fn(() => ({
    lines: [],
    split: vi.fn(),
  })),
  __esModule: true, // to force ES module compatibility
}));

vi.mock("react-redux", () => ({
  useSelector: vi.fn().mockReturnValue({
    blockchain: { account: "", smartContract: null },
    data: {},
  }),
  useDispatch: () => vi.fn(),
}));

vi.mock("ethers", () => ({
  Contract: vi.fn(),
  providers: { Web3Provider: vi.fn() },
  utils: { formatUnits: vi.fn() },
}));

vi.mock("web3modal", () => ({
  default: vi.fn().mockImplementation(() => ({ connect: vi.fn() })),
}));
