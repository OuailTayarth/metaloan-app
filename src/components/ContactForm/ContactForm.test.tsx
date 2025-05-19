import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";
import emailsjs from "@emailjs/browser";

// Mock external dependencies
vi.mock("@emailjs/browser", () => ({
  __esModule: true,
  default: { sendForm: vi.fn().mockResolvedValue({ text: "Email sent" }) }, // EmailJS returns { text: string }
}));

vi.mock("../Alert/Alert", () => ({ default: () => <div>Alert Mock</div> }));

describe("ContactForm", () => {
  // Mock props
  const mockRemoveAlert = vi.fn();

  beforeEach(() => {
    // Mock ENV variables (required for sendForm() logic)
    process.env = {
      REACT_APP_EMAIL_SERVICE: "mock-service",
      REACT_APP_EMAIL_TEMPLATE: "mock-template",
      REACT_APP_EMAIL_KEY: "mock-key",
    };
  });

  it("renders heading, form inputs, and submit button correctly", () => {
    render(<ContactForm alert={null} removeAlert={mockRemoveAlert} />);
    // Heading
    expect(screen.getByText("Request a Loan")).toBeInTheDocument();

    // Inputs
    expect(
      screen.getByPlaceholderText("First & Last Name")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Link to the desired Land(Decentraland)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Anything else we should know")
    ).toBeInTheDocument();

    // CheckBox
    const checkBox = screen.getByRole("checkbox");
    // check the checkBox to be in the document
    expect(checkBox).toBeInTheDocument();
    // check the checkBox to be in it default state
    expect(checkBox).not.toBeChecked();

    expect(
      screen.getByText(/MetaLoan requires a down payment of up to 50%/)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits form, triggers success alert, verify the correct submitted form values", async () => {
    render(<ContactForm alert={null} removeAlert={mockRemoveAlert} />);

    const checkBox = screen.getByRole("checkbox");

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("First & Last Name"), {
      target: { value: "David Joe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "David@test.com" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Link to the desired Land(Decentraland)"),
      {
        target: { value: "DigitalLand.com" },
      }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Link to the desired Land(Decentraland)"),
      {
        target: { value: "DigitalLand.com" },
      }
    );
    fireEvent.change(
      screen.getByPlaceholderText("Anything else we should know"),
      {
        target: { value: "I'm interested buying a digital land...." },
      }
    );
    fireEvent.click(checkBox);

    fireEvent.submit(screen.getByRole("form", { name: "Contact" }));

    await waitFor(() => {
      // Verify email sent + alert called with success message
      expect(emailsjs.sendForm).toHaveBeenCalledWith(
        "mock-service",
        "mock-template",
        expect.any(HTMLFormElement),
        "mock-key"
      );
      expect(mockRemoveAlert).toHaveBeenCalledWith(
        true,
        "Thank you! MetaLoan will review your request and e-mail with more information to complete your loan."
      );

      // access the history call on the sendForm
      const submittedForm = vi.mocked(emailsjs.sendForm).mock
        .calls[0][2] as HTMLFormElement;

      // verify the correct submitted form values were send to email.js.sendFrom;
      const nameInput = submittedForm.elements.namedItem(
        "user_name"
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("David Joe");

      const emailInput = submittedForm.elements.namedItem(
        "user_email"
      ) as HTMLInputElement;
      expect(emailInput.value).toBe("David@test.com");

      const linkInput = submittedForm.elements.namedItem(
        "user_link"
      ) as HTMLInputElement;
      expect(linkInput.value).toBe("DigitalLand.com");

      const messageInput = submittedForm.elements.namedItem(
        "user_message"
      ) as HTMLInputElement;
      expect(messageInput.value).toBe(
        "I'm interested buying a digital land...."
      );

      const checkboxInput = submittedForm.elements.namedItem(
        "user_checkbox"
      ) as HTMLInputElement;
      expect(checkboxInput.value).toBe(
        "The user acknowledge that MetaLoan requires payment of 50% down payment before any purchase"
      );
    });
  });

  it("toggles checkbox value on click", () => {
    render(<ContactForm alert={null} removeAlert={mockRemoveAlert} />);
    const checkbox = screen.getByRole("checkbox");

    // Initial state
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute(
      "value",
      "The user didn't acknowledge that MetaLoan requires payment of 50% down payment before any purchase"
    );

    // After click
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute(
      "value",
      "The user acknowledge that MetaLoan requires payment of 50% down payment before any purchase"
    );
  });

  it("fails if ENV vars missing", async () => {
    delete process.env.REACT_APP_EMAIL_SERVICE;
    render(<ContactForm alert={null} removeAlert={mockRemoveAlert} />);

    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => {
      expect(emailsjs.sendForm).not.toHaveBeenCalled();
    });
  });
});
