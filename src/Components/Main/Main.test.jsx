import { getAllByText, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Main from "./Main";
import Home from "../HomePage/Home";
import Contact from "../Contact/Contact";
import Product from "../Product/Product";
import About from "../About/About";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Pricing from "../Pricing/Pricing";
import ProtectedRoute from "./ProtectedRoute";

// Mocking ProtectedRoute to bypass any authentication logic for testing
vi.mock('./ProtectedRoute', () => ({
  default: ({ children }) => <>{children}</>,
}));

describe("Main Component Routing", () => {
  it("renders Home component on default route", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getByText(/home.hero.heading/i)).toBeInTheDocument();
  });

  it("renders Product component on '/product' route", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/product"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getByText(/feedbackapp/i)).toBeInTheDocument();
  });

  it("renders About component on '/about' route", () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getAllByText(/about/i).length).toBeGreaterThan(1);
  });

  it("renders Contact component on '/contact' route", () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={["/contact"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getAllByText(/contact/i).length).toBeGreaterThan(1);
  });

  it("renders Login component on '/login' route", () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getAllByText(/login/i).length).toBeGreaterThan(1);
  });

  it("renders Register component on '/register' route", () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={["/register"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getAllByText(/register/i).length).toBeGreaterThan(1);
  });

  it("renders Home component on '/home' route (duplicate route case)", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getByText(/home.hero.heading/i)).toBeInTheDocument();
  });

  it("renders Protected Home component on unknown route", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/random"]}>
        <Main />
      </MemoryRouter>
    );
    expect(getByText(/home.hero.heading/i)).toBeInTheDocument();
  });
});