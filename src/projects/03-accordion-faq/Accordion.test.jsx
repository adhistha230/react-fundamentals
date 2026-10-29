import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AccordionFaq from "./index.jsx";

const header = (text) => screen.getByRole("button", { name: new RegExp(text, "i") });
const headers = () => screen.getAllByRole("button");

describe("Accordion FAQ", () => {
  it("renders every question with all panels closed", () => {
    render(<AccordionFaq />);

    expect(headers()).toHaveLength(5);
    expect(screen.queryAllByRole("region")).toHaveLength(0);
    headers().forEach((button) => {
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("opens a panel on click and reports it as expanded", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    await user.click(header("difference between state and props"));

    expect(header("difference between state and props")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("region")).toHaveTextContent(/props are passed in/i);
  });

  it("closes the previous panel when another is opened", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    await user.click(header("difference between state and props"));
    await user.click(header("why does react want a key"));

    expect(header("difference between state and props")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(header("why does react want a key")).toHaveAttribute("aria-expanded", "true");
    // The invariant worth pinning: never more than one open panel.
    expect(screen.getAllByRole("region")).toHaveLength(1);
  });

  it("collapses the open panel when its own header is clicked again", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    const trigger = header("what makes an input controlled");
    await user.click(trigger);
    await user.click(trigger);

    expect(header("what makes an input controlled")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryAllByRole("region")).toHaveLength(0);
  });

  it("removes closed panel content from the DOM rather than hiding it", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    expect(screen.queryByText(/props are passed in/i)).not.toBeInTheDocument();

    await user.click(header("difference between state and props"));
    expect(screen.getByText(/props are passed in/i)).toBeInTheDocument();

    await user.click(header("difference between state and props"));
    expect(screen.queryByText(/props are passed in/i)).not.toBeInTheDocument();
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    await user.tab();
    expect(headers()[0]).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(headers()[0]).toHaveAttribute("aria-expanded", "true");

    await user.keyboard(" ");
    expect(headers()[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("reaches each header in order by tabbing", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    await user.tab();
    await user.tab();

    expect(headers()[1]).toHaveFocus();
  });

  it("ties the open panel to the header that controls it", async () => {
    const user = userEvent.setup();
    render(<AccordionFaq />);

    const trigger = header("does transforming data for display need useeffect");
    await user.click(trigger);

    const panel = screen.getByRole("region");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    // The region's accessible name comes from the header, so it is announced as the
    // question rather than as an unnamed region.
    expect(screen.getByRole("region", { name: /need useeffect/i })).toBe(panel);
  });

  it("exposes the questions as headings for heading navigation", () => {
    render(<AccordionFaq />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });
});
