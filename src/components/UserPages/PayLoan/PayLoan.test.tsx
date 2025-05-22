// PayLoan.test.tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PayLoan from "./PayLoan";
import type { PayLoanProps } from "../../../models/payLoanProps";

const mockProps: PayLoanProps = {
  payLoan: vi.fn(),
  decrementLoanId: vi.fn(),
  incrementLoanId: vi.fn(),
  loanId: 1,
  alert: { show: false, msg: "" },
  removeAlert: vi.fn(),
  activePayment: false,
};

describe("PayLoan Component", () => {
  it("renders core elements", () => {
    render(<PayLoan {...mockProps} />);
    expect(
      screen.getByText("Don't forget to pay your loan on time!")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Make sure to select the right number of/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pay Loan" })
    ).toBeInTheDocument();
  });

  it("handles increment/decrement clicks", () => {
    render(<PayLoan {...mockProps} />);
    fireEvent.click(screen.getByText("+"));
    expect(mockProps.incrementLoanId).toHaveBeenCalled();
    fireEvent.click(screen.getByText("-"));
    expect(mockProps.decrementLoanId).toHaveBeenCalled();
  });

  // button state when activePayment is true
  it("disables buttons when activePayment true", () => {
    render(<PayLoan {...mockProps} activePayment={true} />);
    expect(screen.getByRole("button", { name: "Busy..." })).toBeDisabled();
    expect(screen.getByText("+").closest("button")).toBeDisabled();
    expect(screen.getByText("-").closest("button")).toBeDisabled();
  });

  it("shows alert when present", () => {
    render(
      <PayLoan {...mockProps} alert={{ show: true, msg: "Processing!" }} />
    );
    expect(screen.getByText("Processing!")).toBeInTheDocument();
  });
});
