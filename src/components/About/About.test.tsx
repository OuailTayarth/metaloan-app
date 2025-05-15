import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import gsap from "gsap";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// mock gsap library to stop animation from executing during test
vi.mock("gsap", () => ({
  default: {
    // Add default export
    fromTo: vi.fn().mockReturnValue({}), // create a fake gsap object
  },
  __esModule: true,
}));

describe("About Component", () => {
  // Setup mock for navigate
  const mockNavigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  // Cleanup mocks after each test
  afterEach(() => {
    vi.clearAllMocks();
  });
  // Check if all elements render
  it("renders heading, paragraph, button, and image correctly", () => {
    render(<About />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText(/As the only lending company/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request A Loan" })
    ).toBeInTheDocument();
    expect(screen.getByAltText("aboutImg")).toBeInTheDocument();
  });

  // Verify initial state and state change after useEffect
  // it("starts with hidden textBox and reveals it after useEffect", async () => {
  //   render(<About />);
  //   // <div className={`textBox ${isHidden ? "hidden" : ""}`}></div>
  //   const textBox = screen.getByText("About Us").closest(".textBox");
  //   expect(textBox).toHaveClass("hidden"); // Asserts initial state (isHidden = true)
  //   // Wait for useEffect to run (it sets isHidden to false)
  //   await vi.waitFor(
  //     () => {
  //       expect(textBox).not.toHaveClass("hidden"); // Asserts state change
  //     },
  //     { timeout: 100 }
  //   );
  // });

  // Test button click navigation
  // it('navigates to "launchApp/submitLoan" when button is clicked', () => {
  //   render(<About />);
  //   const button = screen.getByRole("button", { name: "Request A Loan" });
  //   fireEvent.click(button); // Simulate click
  //   expect(mockNavigate).toHaveBeenCalledWith("launchApp/submitLoan"); // Asserts navigation call
  // });
});
