import React from "react";
import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// TODO: Add integration tests after child components are stable

// TODO: Add more mocks
// Mock react-router-dom to preserve BrowserRouter
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
  };
});

describe("App component", () => {
  it("renders safely", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});
