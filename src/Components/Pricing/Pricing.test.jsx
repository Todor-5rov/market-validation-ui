
// Import necessary libraries and modules
import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pricing from './Pricing';
import { usePricing } from './pricingFunctions';

// Mock the Navbar component, CSS import, and usePricing function
vi.mock('../Repeating/Navbar/Navbar', () => ({
  default: () => <div>Mock Navbar</div>
}));

vi.mock('./Pricing.css', () => ({}));

vi.mock('./pricingFunctions', () => ({
  usePricing: vi.fn()
}));

describe("Pricing Component", () => {
  it("should render without crashing", () => {
    usePricing.mockReturnValue({
      renderPricingTable: () => <div>Pricing Table Content</div>
    });

    render(<Pricing />);
    expect(screen.getByText("Pricing Table Content")).toBeInTheDocument();
  });

  it("should handle when renderPricingTable returns null", () => {
    usePricing.mockReturnValue({
      renderPricingTable: () => null
    });

    render(<Pricing />);
    expect(screen.queryByText("Pricing Table Content")).not.toBeInTheDocument();
  });

  it("should handle an error thrown by renderPricingTable", () => {
    usePricing.mockImplementation(() => {
      throw new Error("Failed to render pricing table");
    });

    expect(() => render(<Pricing />)).toThrow("Failed to render pricing table");
  });

  it("should render the correct CSS class", () => {
    usePricing.mockReturnValue({
      renderPricingTable: () => <div>Pricing Table Content</div>
    });

    const { container } = render(<Pricing />);
    expect(container.firstChild).toHaveClass("wrapper");
  });
});
