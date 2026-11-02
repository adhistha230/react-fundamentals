import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TabsComponent from "./index.jsx";

const tab = (name) => screen.getByRole("tab", { name });
const panel = () => screen.getByRole("tabpanel");

// Every keyboard test starts from a focused tab, since the handler acts on the focused one.
const focusFirstTab = async (user) => {
  await user.tab();
  expect(tab("Props")).toHaveFocus();
};

describe("Tabs component", () => {
  it("selects the first tab and shows only its panel", () => {
    render(<TabsComponent />);

    expect(tab("Props")).toHaveAttribute("aria-selected", "true");
    expect(tab("State")).toHaveAttribute("aria-selected", "false");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(panel()).toHaveAccessibleName("Props");
  });

  it("swaps the panel when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);

    await user.click(tab("Context"));

    expect(tab("Context")).toHaveAttribute("aria-selected", "true");
    expect(tab("Props")).toHaveAttribute("aria-selected", "false");
    expect(panel()).toHaveAccessibleName("Context");
    expect(panel()).toHaveTextContent(/skips the prop chain/i);
  });

  it("wires each tab to the panel it controls", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);

    await user.click(tab("Refs"));

    expect(tab("Refs")).toHaveAttribute("aria-controls", panel().id);
    expect(panel()).toHaveAttribute("aria-labelledby", tab("Refs").id);
  });

  it("keeps the tablist to a single tab stop via roving tabindex", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);

    expect(tab("Props")).toHaveAttribute("tabindex", "0");
    expect(tab("State")).toHaveAttribute("tabindex", "-1");

    // One Tab reaches the selected tab, the next leaves the list for the panel rather
    // than stepping through the three unselected tabs.
    await focusFirstTab(user);
    await user.tab();
    expect(panel()).toHaveFocus();
  });

  it("moves the tabindex along with the selection", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);

    await user.click(tab("State"));

    expect(tab("State")).toHaveAttribute("tabindex", "0");
    expect(tab("Props")).toHaveAttribute("tabindex", "-1");
  });

  it("selects and focuses the next tab on ArrowRight", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);
    await focusFirstTab(user);

    await user.keyboard("{ArrowRight}");

    expect(tab("State")).toHaveFocus();
    expect(tab("State")).toHaveAttribute("aria-selected", "true");
    expect(panel()).toHaveAccessibleName("State");
  });

  it("wraps from the last tab to the first on ArrowRight", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);

    await user.click(tab("Refs"));
    await user.keyboard("{ArrowRight}");

    expect(tab("Props")).toHaveFocus();
    expect(tab("Props")).toHaveAttribute("aria-selected", "true");
  });

  it("wraps from the first tab to the last on ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);
    await focusFirstTab(user);

    await user.keyboard("{ArrowLeft}");

    expect(tab("Refs")).toHaveFocus();
    expect(tab("Refs")).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to the first and last tabs with Home and End", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);
    await focusFirstTab(user);

    await user.keyboard("{End}");
    expect(tab("Refs")).toHaveFocus();
    expect(tab("Refs")).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(tab("Props")).toHaveFocus();
    expect(tab("Props")).toHaveAttribute("aria-selected", "true");
  });

  it("ignores keys the horizontal pattern does not claim", async () => {
    const user = userEvent.setup();
    render(<TabsComponent />);
    await focusFirstTab(user);

    await user.keyboard("{ArrowDown}");

    expect(tab("Props")).toHaveFocus();
    expect(tab("Props")).toHaveAttribute("aria-selected", "true");
  });
});
