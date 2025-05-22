import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import About from "./About";
import { mockNavigate } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";

describe("About Component", () => {
  // check if all elements render correctly
  it("renders heading, paragraph, button, and image correctly", () => {
    render(<About />);
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText(/As the only lending company/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request A Loan" })
    ).toBeInTheDocument();
    expect(screen.getByAltText("aboutImg")).toBeInTheDocument();
  });

  // verify initial state and state change after useEffect
  it("removes 'hidden' class after initial render", async () => {
    render(<About />);

    const textBox = screen.getByText("About Us").closest(".textBox");
    await waitFor(() => {
      expect(textBox).not.toHaveClass("hidden"); // Wait for useEffect to update state
    });
  });

  // test button click navigation
  it('navigates to "launchApp/submitLoan" when button is clicked', () => {
    render(<About />);
    const button = screen.getByRole("button", { name: "Request A Loan" });
    fireEvent.click(button); // Simulate click
    expect(mockNavigate).toHaveBeenCalledWith("launchApp/submitLoan"); // Asserts navigation call
  });
});
