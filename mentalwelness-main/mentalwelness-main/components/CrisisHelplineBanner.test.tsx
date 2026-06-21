import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CrisisHelplineBanner from "./CrisisHelplineBanner";

describe("CrisisHelplineBanner", () => {
  it("renders crisis alert with helpline numbers", () => {
    render(<CrisisHelplineBanner />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/You matter/i)).toBeInTheDocument();
    expect(screen.getByText("14416")).toBeInTheDocument();
    expect(screen.getByText("1860-2662-345")).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button clicked", () => {
    const onDismiss = vi.fn();
    render(<CrisisHelplineBanner onDismiss={onDismiss} />);
    screen.getByText(/dismiss/i).click();
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
