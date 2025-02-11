import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useLogin } from "./loginFunctions";
import Login from "./Login";

vi.mock("./loginFunctions");

describe("Login Component", () => {
  let mockSetEmail, mockSetPassword, mockHandleLogin, mockHandleGoogleSignIn, mockHandleForgotPassword, mockNavigate, mockHandleLanguageChange;
 beforeEach(() => {
    mockSetEmail = vi.fn();
    mockSetPassword = vi.fn();
    mockHandleLogin = vi.fn();
    mockHandleGoogleSignIn = vi.fn();
    mockHandleForgotPassword = vi.fn();
    mockNavigate = vi.fn();
    mockHandleLanguageChange = vi.fn();

    useLogin.mockReturnValue({
      email: "test@example.com",
      setEmail: mockSetEmail,
      password: "password",
      setPassword: mockSetPassword,
      error: "",
      message: "",
      handleLogin: mockHandleLogin,
      handleGoogleSignIn: mockHandleGoogleSignIn,
      handleForgotPassword: mockHandleForgotPassword,
      handleLanguageChange: mockHandleLanguageChange,
      navigate: mockNavigate,
      t: (key) => key,
      i18n: { language: "en" },
    });
  });

  it("renders login form correctly", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("login.email_placeholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("login.password_placeholder")).toBeInTheDocument();
    expect(screen.getByText("login.login_button")).toBeInTheDocument();
    expect(screen.getByText("login.google_signin_button")).toBeInTheDocument();
  });

  it("calls setEmail on email input change", () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("login.email_placeholder"), { target: { value: "newemail@example.com" } });
    expect(mockSetEmail).toHaveBeenCalledWith("newemail@example.com");
  });

  it("calls setPassword on password input change", () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("login.password_placeholder"), { target: { value: "newpassword" } });
    expect(mockSetPassword).toHaveBeenCalledWith("newpassword");
  });

  it("calls handleLogin on login button click", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("login.login_button"));
    expect(mockHandleLogin).toHaveBeenCalled();
  });

  it("calls handleGoogleSignIn on Google Sign-In button click", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("login.google_signin_button"));
    expect(mockHandleGoogleSignIn).toHaveBeenCalled();
  });

  it("displays error message when there is an error", () => {
    useLogin.mockReturnValueOnce({
      ...useLogin(),
      error: "Error message",
    });
    render(<Login />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("displays success message when there is a message", () => {
    useLogin.mockReturnValueOnce({
      ...useLogin(),
      message: "Success message",
    });
    render(<Login />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("calls handleForgotPassword on forgot password text click", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("login.forgot_password"));
    expect(mockHandleForgotPassword).toHaveBeenCalled();
  });

  it("navigates to register page on register link click", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("login.register_link"));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("switches language to English when 'EN' is clicked", () => {
    useLogin.mockReturnValueOnce({
      ...useLogin(),
      i18n: { language: "bg" },
    });
    render(<Login />);
    fireEvent.click(screen.getByText("EN"));
    expect(mockHandleLanguageChange).toHaveBeenCalledWith("en");
  });

  it("switches language to Bulgarian when 'BG' is clicked", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("BG"));
    expect(mockHandleLanguageChange).toHaveBeenCalledWith("bg");
  });
});