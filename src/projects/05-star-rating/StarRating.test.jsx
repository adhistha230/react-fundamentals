import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import StarRating from "./index.jsx";

const star = (name) => screen.getByRole("radio", { name });
// The rating as the readout shows it. Matched on its own exact text, which is why the
// regex is anchored: the inputs carry sr-only names like "3.5 stars" that would otherwise
// collide with it.
const readout = () => screen.getByText(/^\d(\.\d)?$/).textContent;

// The painted fill, star by star: ["100", "50", "0", "0", "0"] is two and a half stars.
// Read off the DOM rather than off state, so a value that renders wrongly still fails.
const fills = () =>
  Array.from(document.querySelectorAll("[data-star-fill]")).map((node) =>
    node.getAttribute("data-star-fill"),
  );

describe("Star rating", () => {
  it("offers one radio per half step and starts unrated", () => {
    render(<StarRating />);

    expect(screen.getAllByRole("radio")).toHaveLength(10);
    expect(star("0.5 stars")).toBeInTheDocument();
    expect(star("1 star")).toBeInTheDocument();
    expect(star("5 stars")).toBeInTheDocument();

    expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument();
    expect(readout()).toBe("0");
    expect(fills()).toEqual(["0", "0", "0", "0", "0"]);
  });

  it("commits a whole-star rating when the right half is clicked", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.click(star("4 stars"));

    expect(star("4 stars")).toBeChecked();
    expect(readout()).toBe("4");
    expect(fills()).toEqual(["100", "100", "100", "100", "0"]);
  });

  it("commits a half-star rating when the left half is clicked", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.click(star("2.5 stars"));

    expect(star("2.5 stars")).toBeChecked();
    expect(readout()).toBe("2.5");
    expect(fills()).toEqual(["100", "100", "50", "0", "0"]);
  });

  it("keeps exactly one rating selected", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.click(star("3 stars"));
    await user.click(star("1.5 stars"));

    expect(star("1.5 stars")).toBeChecked();
    expect(star("3 stars")).not.toBeChecked();
    expect(screen.getAllByRole("radio", { checked: true })).toHaveLength(1);
  });

  it("previews on hover without committing anything", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.hover(star("3.5 stars"));

    expect(readout()).toBe("3.5");
    expect(fills()).toEqual(["100", "100", "100", "50", "0"]);
    // The point of the whole widget: the paint moved, the value did not.
    expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument();
  });

  it("previews over an existing rating and restores it on exit", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.click(star("2 stars"));
    await user.hover(star("5 stars"));

    expect(readout()).toBe("5");
    expect(star("2 stars")).toBeChecked();

    await user.unhover(star("5 stars"));

    expect(readout()).toBe("2");
    expect(fills()).toEqual(["100", "100", "0", "0", "0"]);
  });

  it("labels the readout as a preview only while hovering", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    expect(screen.getByText("Your rating")).toBeInTheDocument();

    await user.hover(star("1 star"));
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.queryByText("Your rating")).not.toBeInTheDocument();

    await user.unhover(star("1 star"));
    expect(screen.getByText("Your rating")).toBeInTheDocument();
  });

  it("is reachable and selectable by keyboard in a single tab stop", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.tab();
    expect(star("0.5 stars")).toHaveFocus();

    await user.keyboard("[Space]");
    expect(star("0.5 stars")).toBeChecked();

    // Tab leaves the group rather than stepping through the other nine inputs.
    await user.tab();
    expect(screen.getByRole("button", { name: /clear/i })).toHaveFocus();
  });

  it("moves the selection a half step at a time with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<StarRating />);

    await user.click(star("3 stars"));
    await user.keyboard("{ArrowRight}");

    expect(star("3.5 stars")).toBeChecked();
    expect(star("3.5 stars")).toHaveFocus();
    expect(readout()).toBe("3.5");

    await user.keyboard("{ArrowLeft}{ArrowLeft}");

    expect(star("2.5 stars")).toBeChecked();
    expect(readout()).toBe("2.5");
  });

  it("clears back to unrated, and offers no clear when there is nothing to clear", async () => {
    const user = userEvent.setup();
    render(<StarRating />);
    const clear = screen.getByRole("button", { name: /clear/i });

    expect(clear).toBeDisabled();

    await user.click(star("4.5 stars"));
    expect(clear).toBeEnabled();

    await user.click(clear);

    expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument();
    expect(readout()).toBe("0");
    expect(fills()).toEqual(["0", "0", "0", "0", "0"]);
    expect(clear).toBeDisabled();
  });

  it("gives each instance its own radio group", () => {
    render(
      <>
        <StarRating />
        <StarRating />
      </>,
    );

    const names = new Set(screen.getAllByRole("radio").map((node) => node.name));

    expect(names.size).toBe(2);
  });
});
