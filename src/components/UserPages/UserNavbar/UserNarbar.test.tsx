// UserNavbar.test.tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import type { LaunchAppProps } from "../../../models/LaunchAppProps";

const mockProps: LaunchAppProps = {
  fetchLoanData: vi.fn(),
  fetchBorrowersData: vi.fn(),
};

describe("UserNavbar Component", () => {
  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <UserNavbar {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Borrowers")).toBeInTheDocument();
    expect(screen.getByText("Submit Loan")).toBeInTheDocument();
    expect(screen.getByText("Pay Loan")).toBeInTheDocument();
    expect(screen.getByText("MyLoan")).toBeInTheDocument();
  });
});
