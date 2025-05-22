// Navbar.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  // Basic rendering tests
  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Request a Loan")).toBeInTheDocument();
    expect(screen.getByText("Launch App")).toBeInTheDocument();
  });

  // mobile menu behavior
  it("toggles mobile menu on button click", () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = container.querySelector(".toggle-menu");
    fireEvent.click(menuButton!);
    expect(container.querySelector(".navigation.active")).toBeInTheDocument();

    fireEvent.click(menuButton!);
    expect(
      container.querySelector(".navigation:not(.active)")
    ).toBeInTheDocument();
  });
});
