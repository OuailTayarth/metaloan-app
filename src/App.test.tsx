// App.test.tsx
import React from "react";
import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./components/Loaders/cubeLoader", () => ({
  default: () => <div data-testId="cube-loader">Loading...</div>,
}));

vi.mock("./components/Home", () => ({
  default: () => <div>Home Page Content</div>,
}));

vi.mock("./components/Navbar/Navbar", () => ({
  default: () => <div>Navbar Page Content</div>,
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
      path: "/howitWorks",
      name: "HowItWorks",
      content: "How It Works Content",
    },
    {
      path: "/requestloan",
      name: "ContactForm",
      content: "Contact Form Content",
    },
  ];

  routes.forEach(({ path, name, content }) => {
    it.only(`renders ${name} page at ${path} route`, async () => {
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
});
