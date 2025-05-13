import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import About from "./About";
import gsap from "gsap";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

// Mock gsap for animation testing
vi.mock("gsap", () => ({
  fromTo: vi.fn(), // Mock gsap.fromTo to track calls
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
    expect(screen.getByText("About Us")).toBeInTheDocument(); // Asserts heading exists
    expect(screen.getByText(/As the only lending company/)).toBeInTheDocument(); // Asserts paragraph text
    expect(
      screen.getByRole("button", { name: "Request A Loan" })
    ).toBeInTheDocument(); // Asserts button
    expect(screen.getByAltText("aboutImg")).toBeInTheDocument(); // Asserts image
  });

  // Verify initial state and state change after useEffect
  it("starts with hidden textBox and reveals it after useEffect", async () => {
    render(<About />);
    const textBox = screen.getByText("About Us").closest(".textBox");
    expect(textBox).toHaveClass("hidden"); // Asserts initial state (isHidden = true)
    // Wait for useEffect to run (it sets isHidden to false)
    await vi.waitFor(
      () => {
        expect(textBox).not.toHaveClass("hidden"); // Asserts state change
      },
      { timeout: 100 }
    );
  });

  // Test button click navigation
  it('navigates to "launchApp/submitLoan" when button is clicked', () => {
    render(<About />);
    const button = screen.getByRole("button", { name: "Request A Loan" });
    fireEvent.click(button); // Simulate click
    expect(mockNavigate).toHaveBeenCalledWith("launchApp/submitLoan"); // Asserts navigation call
  });
});
