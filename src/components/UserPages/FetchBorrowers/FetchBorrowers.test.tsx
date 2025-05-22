// FetchBorrowers.test.tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FetchBorrowers from "./FetchBorrowers";
import { BorrowerDataType } from "../../../models/borrowerData";

// mock borrower Data
const mockBorrowers: BorrowerDataType[] = [
  {
    borrower: "alice",
    start: "2023-01-01",
    nextPayment: "2023-02-01",
    activated: "Active",
  },
  {
    borrower: "bob",
    start: "2023-03-01",
    nextPayment: "2023-04-01",
    activated: "Inactive",
  },
];

describe("FetchBorrowers Component", () => {
  it("shows 'no borrowers' message when borrower data empty array", () => {
    render(<FetchBorrowers BorrowersData={[]} />);
    expect(
      screen.getByText(/no borrowers have been added yet/i)
    ).toBeInTheDocument();
  });

  it("renders correct number of borrower cards", () => {
    render(<FetchBorrowers BorrowersData={mockBorrowers} />);
    const cards = screen.getAllByRole("article");
    console.log(cards);
    expect(cards).toHaveLength(2);
  });

  it("displays correct borrower data", () => {
    render(<FetchBorrowers BorrowersData={[mockBorrowers[0]]} />);

    expect(screen.getByText(mockBorrowers[0].borrower)).toBeInTheDocument();
    expect(screen.getByText(mockBorrowers[0].start)).toBeInTheDocument();
    expect(screen.getByText(mockBorrowers[0].nextPayment)).toBeInTheDocument();
    expect(screen.getByText(mockBorrowers[0].activated)).toBeInTheDocument();
  });
});
