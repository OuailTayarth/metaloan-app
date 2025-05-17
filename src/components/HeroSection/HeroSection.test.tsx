import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { mockNavigate } from "../../test/test-utils";

describe("HeroSection Component", () => {
  it("renders all content correctly", () => {
    render(<HeroSection />);
    expect(screen.getByText("FINANCING THE METAVERSE")).toBeInTheDocument();
    expect(screen.getByText("MetaLoan")).toBeInTheDocument();
    expect(
      screen.getByText(/metaverse unlocks new opportunities/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Request A Loan" })
    ).toBeInTheDocument();
    expect(screen.getByAltText("ImageHero")).toBeInTheDocument();
  });

  it("removes hidden class after mount", async () => {
    render(<HeroSection />);
    const textBox = screen.getByText("MetaLoan").closest(".textBox");
    await waitFor(() => expect(textBox).not.toHaveClass("hidden"));
  });

  it("navigates to loan page on button click", () => {
    render(<HeroSection />);
    fireEvent.click(screen.getByRole("button", { name: "Request A Loan" }));
    expect(mockNavigate).toHaveBeenCalledWith("/requestloan");
  });
});
