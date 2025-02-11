import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './Home';
import { useTranslation } from 'react-i18next';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('LandingPage Component', () => {
  it('renders without crashing', () => {
    useTranslation.mockReturnValue({ t: (key) => key });
    const { container } = render(<LandingPage />);
    expect(container).toBeDefined();
  });

  it('renders the hero section with heading and subtitle', () => {
    useTranslation.mockReturnValue({
      t: (key) => ({
        "home.hero.heading": "Welcome to Our Platform",
        "home.hero.subtitle": "Best place to grow your business",
      }[key]),
    });
    
    const { getByText } = render(<LandingPage />);
    
    expect(getByText("Welcome to Our Platform")).toBeInTheDocument();
    expect(getByText("Best place to grow your business")).toBeInTheDocument();
  });

  it('renders all features with correct titles and descriptions', () => {
    useTranslation.mockReturnValue({
      t: (key) => ({
        "home.features.automated_email_campaigns.title": "Automated Email Campaigns",
        "home.features.automated_email_campaigns.description": "Easily automate your email marketing.",
        "home.features.actionable_insights.title": "Actionable Insights",
        "home.features.actionable_insights.description": "Gain insights from your data.",
        "home.features.seamless_data_collection.title": "Seamless Data Collection",
        "home.features.seamless_data_collection.description": "Collect data without any hassle.",
      }[key]),
    });

    const { getByText, getAllByText } = render(<LandingPage />);
 expect(getByText("Automated Email Campaigns")).toBeInTheDocument();
    expect(getByText("Easily automate your email marketing.")).toBeInTheDocument();

    expect(getByText("Actionable Insights")).toBeInTheDocument();
    expect(getByText("Gain insights from your data.")).toBeInTheDocument();

    expect(getByText("Seamless Data Collection")).toBeInTheDocument();
    expect(getByText("Collect data without any hassle.")).toBeInTheDocument();
  });

  it('renders images with correct alt attributes', () => {
    useTranslation.mockReturnValue({
      t: (key) => ({
        "home.features.automated_email_campaigns.title": "Automated Email Campaigns",
        "home.features.actionable_insights.title": "Actionable Insights",
        "home.features.seamless_data_collection.title": "Seamless Data Collection",
      }[key]),
    });

    const { getByAltText } = render(<LandingPage />);
    
    expect(getByAltText("Automated Email Campaigns")).toBeInTheDocument();
    expect(getByAltText("Actionable Insights")).toBeInTheDocument();
    expect(getByAltText("Seamless Data Collection")).toBeInTheDocument();
  });

  it('properly uses the translation hook', () => {
    const mockT = vi.fn((key) => key);
    useTranslation.mockReturnValue({ t: mockT });
    
    render(<LandingPage />);
 expect(mockT).toHaveBeenCalledWith("home.hero.heading");
    expect(mockT).toHaveBeenCalledWith("home.hero.subtitle");
    expect(mockT).toHaveBeenCalledWith("home.features.section_heading");
    expect(mockT).toHaveBeenCalledWith("home.features.automated_email_campaigns.title");
    expect(mockT).toHaveBeenCalledWith("home.features.automated_email_campaigns.description");
    expect(mockT).toHaveBeenCalledWith("home.features.actionable_insights.title");
    expect(mockT).toHaveBeenCalledWith("home.features.actionable_insights.description");
    expect(mockT).toHaveBeenCalledWith("home.features.seamless_data_collection.title");
    expect(mockT).toHaveBeenCalledWith("home.features.seamless_data_collection.description");
  });
});