// App.test.tsx
import React from "react";
import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Link } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";

vi.mock("./components/Loaders/cubeLoader", () => ({
  default: () => <div data-testId="cube-loader">Loading...</div>,
}));

vi.mock("./components/Home", () => ({
  default: () => <div>Home Page Content</div>,
}));

vi.mock("./components/Navbar/Navbar", () => ({
  default: () => (
    <nav>
      <div>Navbar Page Content</div>
      <Link to="/about">About</Link>
      <Link to="/howItWorks">How It Works</Link>
    </nav>
  ),
}));

vi.mock("./components/About/About", () => ({
  default: () => <div>About Page Content</div>,
}));

vi.mock("./components/HowItWorks/HowItoWorks", () => ({
  default: () => <div>How It Works Content</div>,
}));

vi.mock("./components/ContactForm/ContactForm", () => ({
  default: () => <div>Contact Form Content</div>,
}));

vi.mock("./components/Footer/Footer", () => ({
  default: () => <div>Footer Page Content</div>,
}));

vi.mock("./components/Admin/Admin", () => ({
  default: () => <div>Admin page Content</div>,
}));

vi.mock("./components/UserPages/SubmitLoan/SubmitLoan", () => ({
  default: () => <div>Submit Loan Content</div>,
}));

vi.mock("./components/UserPages/UserNavbar/UserNavbar", () => ({
  default: () => <div>User Navbar Content</div>,
}));

vi.mock("./components/UserPages/PayLoan/PayLoan", () => ({
  default: () => <div>Pay Loan Content</div>,
}));

vi.mock("./components/ErrorPage/ErrorPage", () => ({
  default: () => <div>404 - Page Not Found</div>,
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  it("renders loading spinner initially", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId("cube-loader")).toBeInTheDocument();
  });

  it("renders main content after loading", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId("cube-loader")).toBeInTheDocument();

    // fast forwards 4 second to match the useEffect delay in app.js
    vi.useFakeTimers();
    vi.advanceTimersByTime(4000);
    vi.useRealTimers();

    await waitFor(
      () => {
        expect(screen.queryByTestId("cube-loader")).not.toBeInTheDocument();
        expect(screen.getByText("Home Page Content")).toBeInTheDocument();
        expect(screen.getByText("Navbar Page Content")).toBeInTheDocument();
        expect(screen.getByText("Footer Page Content")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  // Route Validation Tests
  const routes = [
    { path: "/", name: "Home", content: "Home Page Content" },
    { path: "/about", name: "About", content: "About Page Content" },
    {
      path: "/howItWorks",
      name: "HowItWorks",
      content: "How It Works Content",
    },
    {
      path: "/requestloan",
      name: "ContactForm",
      content: "Contact Form Content",
    },
    {
      path: "/admin",
      name: "Admin",
      content: "Admin page Content",
    },
    // nested routes
    {
      path: "/launchApp/submitLoan",
      name: "SubmitLoan",
      content: "Submit Loan Content",
    },

    {
      path: "/launchApp/payLoan",
      name: "PayLoan",
      content: "Pay Loan Content",
    },
    // test Error Page with nonexistent route
    {
      path: "/launchApp/pay",
      name: "PageError",
      content: "404 - Page Not Found",
    },
  ];

  routes.forEach(({ path, name, content }) => {
    it(`renders ${name} page at ${path} route`, async () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );

      // fast forwards 4 second to match the useEffect delay in app.js
      vi.useFakeTimers();
      vi.advanceTimersByTime(4000);
      vi.useRealTimers();

      await waitFor(
        () => {
          expect(screen.getByText(content)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  it("updates content when navigating via navbar links", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // fast forwards 4 second to match the useEffect delay in app.js
    vi.useFakeTimers();
    vi.advanceTimersByTime(4000);
    vi.useRealTimers();

    // wait for initial load
    await waitFor(() => screen.getByText("Home Page Content"), {
      timeout: 5000,
    });

    // click navbar link
    const aboutLink = screen.getByRole("link", { name: /about/i });
    userEvent.click(aboutLink);

    // Verify new route
    await waitFor(() => {
      expect(screen.getByText("About Page Content")).toBeInTheDocument();
    });
  });
});
