import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Admin from "./Admin";
import type { AdminProps } from "../../models/adminProps";

const mockAdminProps: AdminProps = {
  alert: { show: false, msg: "" },
  showAlert: vi.fn(),
  activePayment: false,
  setActivePayment: vi.fn(),
};

const mockShowAlert = vi.fn();

describe("Admin Component", () => {
  it("renders admin form with all inputs and button", () => {
    render(<Admin {...mockAdminProps} />);

    expect(screen.getByText("Welcome Admin!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Lender wallet address")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("USDT address")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Borrower down payment")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Borrower monthly payment")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create plan" })
    ).toBeInTheDocument();
  });

  it("reject negative payment values", () => {
    render(<Admin {...mockAdminProps} showAlert={mockShowAlert} />);
    const monthlyInput = screen.getByPlaceholderText(
      "Borrower monthly payment"
    );
    fireEvent.change(monthlyInput, { target: { value: -100 } });
    fireEvent.submit(screen.getByRole("form", { name: "adminForm" }));
    expect(mockShowAlert).toHaveBeenCalledWith(
      true,
      "Please fill out all form's field!"
    );
  });

  // form validation
  it("shows error when submitting empty form", () => {
    render(<Admin {...mockAdminProps} showAlert={mockShowAlert} />);

    fireEvent.submit(screen.getByRole("form", { name: "adminForm" }));

    expect(mockShowAlert).toHaveBeenCalledWith(
      true,
      "Please fill out all form's field!"
    );
  });

  // button state: enable, disabled
  it("disables button when activePayment is true", () => {
    render(<Admin {...mockAdminProps} activePayment={true} />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("Busy..");
    expect(screen.getByText("Busy..").closest("button")).toBeDisabled();
  });

  // alert display
  it("shows alert when alert.show is true", () => {
    render(
      <Admin {...mockAdminProps} alert={{ show: true, msg: "Test alert" }} />
    );

    expect(screen.getByText("Test alert")).toBeInTheDocument();
  });
});
