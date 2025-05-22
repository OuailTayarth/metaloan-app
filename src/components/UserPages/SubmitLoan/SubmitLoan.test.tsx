// SubmitLoan.test.tsx
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SubmitLoan from "./SubmitLoan";
import type { SubmitLoanProps } from "../../../models/submitLoanProps";

const mockProps: SubmitLoanProps = {
  getLoan: vi.fn(),
  decrementLoanId: vi.fn(),
  incrementLoanId: vi.fn(),
  loanId: 1,
  alert: { show: false, msg: "" },
  removeAlert: vi.fn(),
  activePayment: false,
};

describe("SubmitLoan Component", () => {
  it("renders core elements", () => {
    render(<SubmitLoan {...mockProps} />);

    expect(
      screen.getByText(/deposit 30% as down payment/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit Loan" })
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles increment/decrement clicks", () => {
    render(<SubmitLoan {...mockProps} />);

    fireEvent.click(screen.getByText("+"));
    expect(mockProps.incrementLoanId).toHaveBeenCalled();

    fireEvent.click(screen.getByText("-"));
    expect(mockProps.decrementLoanId).toHaveBeenCalled();
  });

  it("disables buttons during active payment", () => {
    render(<SubmitLoan {...mockProps} activePayment={true} />);

    expect(screen.getByRole("button", { name: "Busy..." })).toBeDisabled();
    expect(screen.getByText("+").closest("button")).toBeDisabled();
    expect(screen.getByText("-").closest("button")).toBeDisabled();
  });

  it("shows alert when present", () => {
    render(
      <SubmitLoan {...mockProps} alert={{ show: true, msg: "Processing!" }} />
    );
    expect(screen.getByText("Processing!")).toBeInTheDocument();
  });
});
