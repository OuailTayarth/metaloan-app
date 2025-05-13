import React from "react";
import Hello from "../components/hello";

import { render } from "@testing-library/react";
import { expect } from "vitest";

describe("first tests", () => {
  it("should render components", () => {
    render(<Hello />);
    expect(true).toBeTruthy();
  });
});
