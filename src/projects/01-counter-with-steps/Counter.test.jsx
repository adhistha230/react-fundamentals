import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Counter from "./index.jsx";

const stepField = () => screen.getByLabelText(/step size/i);

const setStepTo = async (user, value) => {
  await user.clear(stepField());
  await user.type(stepField(), value);
};

describe("Counter with steps", () => {
  it("starts at zero with decrement and reset unavailable", () => {
    render(<Counter />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subtract 1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  it("increments and decrements by the current step", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: "Add 1" }));
    await user.click(screen.getByRole("button", { name: "Add 1" }));
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Subtract 1" }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies a changed step size", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await setStepTo(user, "10");
    await user.click(screen.getByRole("button", { name: "Add 10" }));

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("clamps at the maximum instead of overshooting", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await setStepTo(user, "25");
    const add = screen.getByRole("button", { name: "Add 25" });
    for (let i = 0; i < 5; i += 1) {
      if (!add.disabled) await user.click(add);
    }

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add 25" })).toBeDisabled();
  });

  it("clamps at the minimum instead of going negative", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: "Add 1" }));
    await setStepTo(user, "25");
    await user.click(screen.getByRole("button", { name: "Subtract 25" }));

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("clamps an over-large step down to the maximum step size", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await setStepTo(user, "999");

    expect(screen.getByRole("button", { name: "Add 25" })).toBeInTheDocument();
  });

  it("keeps the step field clearable, falling back to a step of 1", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.clear(stepField());

    expect(stepField()).toHaveValue(null);
    expect(screen.getByRole("button", { name: "Add 1" })).toBeInTheDocument();
  });

  it("resets back to zero", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: "Add 1" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
