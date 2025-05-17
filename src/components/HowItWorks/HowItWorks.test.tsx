import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HowItoWorks from "./HowItoWorks";
import { mockNavigate } from "../../test/test-utils";

describe("HowItWorks Component", () => {
  it("renders content correctly", () => {
    render(<HowItoWorks />);

    expect(screen.getByText("How it Works")).toBeInTheDocument();
    expect(
      screen.getByText(/Get your MetaLoan with just 6 easy steps/)
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: "Request a Loan" })
    ).toBeInTheDocument();
  });

  it("removes hidden class after render", async () => {
    render(<HowItoWorks />);
    const textBox = screen.getByText("How it Works").closest(".textBox");
    await waitFor(() => expect(textBox).not.toHaveClass("hidden"));
  });

  it("navigates to requestLoan on button click", () => {
    render(<HowItoWorks />);
    fireEvent.click(screen.getByRole("button", { name: "Request a Loan" }));
    expect(mockNavigate).toHaveBeenCalledWith("/requestloan");
  });
});
