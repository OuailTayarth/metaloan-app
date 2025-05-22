// FetchLoan.test.tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FetchLoan from "./FetchLoan";

const mockLoanData = {
  borrower: "0x123",
  totalPayment: "1000",
  startLoan: "2023-01-01",
  nextPayment: "2023-02-01",
  activated: "Active",
};

describe("FetchLoan Component", () => {
  it("shows 'loan does not exist' when no data", () => {
    render(<FetchLoan LoanData={null} isBorrowerAddress="0x123" />);
    expect(screen.getByText("Loan does not exist")).toBeInTheDocument();
  });

  it("displays loan details when data exists and account matches", () => {
    render(<FetchLoan LoanData={mockLoanData} isBorrowerAddress="0x123" />);

    expect(screen.getByText(mockLoanData.borrower)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLoanData.totalPayment} USDT`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockLoanData.startLoan)).toBeInTheDocument();
    expect(screen.getByText(mockLoanData.nextPayment)).toBeInTheDocument();
    expect(screen.getByText(mockLoanData.activated)).toBeInTheDocument();
  });

  it("shows error when account doesn't match", () => {
    render(<FetchLoan LoanData={mockLoanData} isBorrowerAddress="0x456" />);
    expect(screen.getByText("Loan does not exist")).toBeInTheDocument();
  });
});
