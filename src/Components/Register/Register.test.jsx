import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { useTranslation } from "react-i18next";
import Register from "./Register";
import { handleRegister, handleGoogleSignIn, handleLanguageChange } from "./registerFunctions";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: (key) => key,
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  })),
}));

vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock("./registerFunctions", () => ({
  handleRegister: vi.fn(),
  handleGoogleSignIn: vi.fn(),
  handleLanguageChange: vi.fn(),
}));

describe("Register component", () => {
  it("should render correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(getByPlaceholderText("register.emailPlaceholder")).toBeInTheDocument();
    expect(getByPlaceholderText("register.passwordPlaceholder")).toBeInTheDocument();
    expect(getByPlaceholderText("register.confirmPasswordPlaceholder")).toBeInTheDocument();
    expect(getByText("register.registerButton")).toBeInTheDocument();
    expect(getByText("register.googleSignInButton")).toBeInTheDocument();
  });

  it("should change language when language option is clicked", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(getByText("EN"));
    expect(handleLanguageChange).toHaveBeenCalledWith("en", expect.anything());

    fireEvent.click(getByText("BG"));
    expect(handleLanguageChange).toHaveBeenCalledWith("bg", expect.anything());
  });

  it("should call handleRegister on register button click", () => {
    const { getByText, getByPlaceholderText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(getByPlaceholderText("register.emailPlaceholder"), { target: { value: "test@example.com" } });
    fireEvent.change(getByPlaceholderText("register.passwordPlaceholder"), { target: { value: "password" } });
    fireEvent.change(getByPlaceholderText("register.confirmPasswordPlaceholder"), { target: { value: "password" } });

    fireEvent.click(getByText("register.registerButton"));
    
    expect(handleRegister).toHaveBeenCalledWith(
      "test@example.com",
      "password",
      "password",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call handleGoogleSignIn on Google sign-in button click", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(getByText("register.googleSignInButton"));

    expect(handleGoogleSignIn).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
  });
});