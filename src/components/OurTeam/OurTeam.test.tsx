import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OurTeam from "./OurTeam";

describe("OurTeam Component", () => {
  it("renders all team members with the correct information", () => {
    render(<OurTeam />);

    expect(screen.getByText("Our Team")).toBeInTheDocument();

    // Member 1: Ouail Tayarth
    expect(screen.getByText("Ouail Tayarth")).toBeInTheDocument();
    expect(screen.getByText("Front-End Developer")).toBeInTheDocument();
    expect(screen.getByAltText("front end developer")).toBeInTheDocument();

    // Member 2: Eduardo Dávalos
    expect(screen.getByText("Eduardo Dávalos")).toBeInTheDocument();
    expect(
      screen.getByText(/Director of Metaverse Planning/)
    ).toBeInTheDocument();
  });

  it("has valid social links with security attributes", () => {
    render(<OurTeam />);

    // Test all links : 4 total
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    // check for secure link attributes
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });

    // verify urls are correctly formatted(to avoid typos)
    expect(links[0].href).toContain(
      "https://www.linkedin.com/in/tayarthouail/"
    );
    expect(links[3].href).toContain("https://twitter.com/metaversearchi_");
  });
});
