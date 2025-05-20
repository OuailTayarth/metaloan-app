// App.test.tsx
import React from "react";
import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

vi.mock("./components/Loaders/cubeLoader", () => ({
  default: () => <div data-testId="cube-loader">Loading...</div>,
}));

vi.mock("./components/Home", () => ({
  default: () => <div>Mock Home</div>,
}));

vi.mock("./components/Navbar/Navbar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

vi.mock("./components/Footer/Footer", () => ({
  default: () => <div>Mock Footer</div>,
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
        expect(screen.queryByTestId("cube-loader")).toBeNull();
        expect(screen.getByText("Mock Home")).toBeInTheDocument();
        expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
        expect(screen.getByText("Mock Footer")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
