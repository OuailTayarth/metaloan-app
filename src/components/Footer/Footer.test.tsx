// Footer.test.tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders core elements", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // main logo link
    expect(screen.getByText("MetaLoan").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });
  it("displays copyright text", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/©MetaLoan.All Right Reserved 2025/i)
    ).toBeInTheDocument();
  });
});
