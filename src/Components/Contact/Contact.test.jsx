import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Contact from "./Contact";
import { useContactForm } from "./contactFunctions";

vi.mock('./contactFunctions', () => ({
  useContactForm: vi.fn(),
}));

describe("Contact Component", () => {
  const tMock = vi.fn((key) => key);
  const handleGoHomeMock = vi.fn();
  let handleChangeMock, handleSubmitMock;

  beforeEach(() => {
    handleChangeMock = vi.fn();
    handleSubmitMock = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render contact form correctly when submitted is false", () => {
    useContactForm.mockReturnValue({
      formData: { name: '', email: '', message: '' },
      submitted: false,
      error: '',
      handleChange: handleChangeMock,
      handleSubmit: handleSubmitMock,
      handleGoHome: handleGoHomeMock,
      t: tMock,
    });

    render(<Contact />);

    expect(screen.getByText("contact.title")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.name.label")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.email.label")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.message.label")).toBeInTheDocument();
    expect(screen.getByText("contact.form.submit_button")).toBeInTheDocument();
  });

  it("should display error message when error is not empty", () => {
    useContactForm.mockReturnValue({
      formData: { name: '', email: '', message: '' },
      submitted: false,
      error: 'Error occurred',
      handleChange: handleChangeMock,
      handleSubmit: handleSubmitMock,
      handleGoHome: handleGoHomeMock,
      t: tMock,
    });

    render(<Contact />);

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("should call handleSubmit when form is submitted", () => {
    useContactForm.mockReturnValue({
      formData: { name: '', email: '', message: '' },
      submitted: false,
      error: '',
      handleChange: handleChangeMock,
      handleSubmit: handleSubmitMock,
      handleGoHome: handleGoHomeMock,
      t: tMock,
    });

    render(<Contact />);

    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmitMock).toHaveBeenCalled();
  });

  it("should call handleChange for each input field change", () => {
    useContactForm.mockReturnValue({
      formData: { name: '', email: '', message: '' },
      submitted: false,
      error: '',
      handleChange: handleChangeMock,
      handleSubmit: handleSubmitMock,
      handleGoHome: handleGoHomeMock,
      t: tMock,
    });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText("contact.form.name.label"), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText("contact.form.email.label"), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText("contact.form.message.label"), { target: { value: 'Hello World' } });

    expect(handleChangeMock).toHaveBeenCalledTimes(3);
  });

  it("should render success message and home button when submitted is true", () => {
    useContactForm.mockReturnValue({
      formData: { name: '', email: '', message: '' },
      submitted: true,
      error: '',
      handleChange: handleChangeMock,
      handleSubmit: handleSubmitMock,
      handleGoHome: handleGoHomeMock,
      t: tMock,
    });

    render(<Contact />);

    expect(screen.getByText("contact.messages.success")).toBeInTheDocument();
    expect(screen.getByText("contact.buttons.home")).toBeInTheDocument();

    fireEvent.click(screen.getByText("contact.buttons.home"));

    expect(handleGoHomeMock).toHaveBeenCalled();
  });
});