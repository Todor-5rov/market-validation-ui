
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import About from "./About";
import { useTranslation, Trans } from "react-i18next";

// Mock the `useTranslation` hook from 'react-i18next'.
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  Trans: ({ i18nKey, components }) => (
    <span>
      {i18nKey === "about.get_in_touch.content"
        ? <>
            Get in touch with us via{" "}
            {React.cloneElement(components.contactLink, {}, "Contact")}
          </>
        : ""}
    </span>
  )
}));

describe("About Component", () => {
  it("should render the main title", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "about.title" })).toBeInTheDocument();
  });

  it("should render the 'Who We Are' section with title and content", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "about.who_we_are.title" })).toBeInTheDocument();
    expect(screen.getByText("about.who_we_are.content")).toBeInTheDocument();
  });

  it("should render the 'Our Story' section with title and content", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "about.our_story.title" })).toBeInTheDocument();
    expect(screen.getByText("about.our_story.content")).toBeInTheDocument();
  });

  it("should render the 'Mission and Vision' section with title and content", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "about.mission_and_vision.title" })).toBeInTheDocument();
    expect(screen.getByText("about.mission_and_vision.content")).toBeInTheDocument();
  });

  it("should render the 'Core Values' section with all value titles and contents", () => {
    render(<About />);
 const valuesHeadings = [
      "about.core_values.values.integrity.title",
      "about.core_values.values.innovation.title",
      "about.core_values.values.community.title",
    ];
    const valuesContents = [
      "about.core_values.values.integrity.content",
      "about.core_values.values.innovation.content",
      "about.core_values.values.community.content",
    ];

    valuesHeadings.forEach((heading) => {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    });

    valuesContents.forEach((content) => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it("should render the 'Why Choose Us' section with title and content", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "about.why_choose_us.title" })).toBeInTheDocument();
    expect(screen.getByText("about.why_choose_us.content")).toBeInTheDocument();
  });
});
