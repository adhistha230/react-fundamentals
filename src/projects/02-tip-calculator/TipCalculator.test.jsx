import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TipCalculator from "./index.jsx";

const billField = () => screen.getByLabelText(/bill amount/i);
const peopleField = () => screen.getByLabelText(/split between/i);

// Each result row is a <dt>/<dd> pair, so read the value next to its label.
const rowValue = (label) =>
  screen.getByText(label).parentElement.querySelector("dd").textContent;

const perPerson = () => screen.getByLabelText(/per person|total due/i).textContent;

const typeBill = async (user, value) => {
  await user.clear(billField());
  await user.type(billField(), value);
};

const setPeople = async (user, value) => {
  await user.clear(peopleField());
  await user.type(peopleField(), value);
};

describe("Tip calculator", () => {
  it("shows zeroes before a bill is entered", () => {
    render(<TipCalculator />);

    expect(rowValue("Bill")).toBe("$0.00");
    expect(rowValue("Total")).toBe("$0.00");
    expect(perPerson()).toBe("$0.00");
  });

  it("applies the default 18% tip", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "50");

    expect(screen.getByRole("radio", { name: "18%" })).toBeChecked();
    expect(rowValue("Tip (18%)")).toBe("$9.00");
    expect(rowValue("Total")).toBe("$59.00");
  });

  it("recomputes when another preset is picked", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "50");
    await user.click(screen.getByRole("radio", { name: "25%" }));

    expect(rowValue("Tip (25%)")).toBe("$12.50");
    expect(rowValue("Total")).toBe("$62.50");
  });

  it("uses a custom tip percentage once Custom is selected", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "40");
    await user.click(screen.getByRole("radio", { name: "Custom" }));
    await user.type(screen.getByLabelText(/custom tip percentage/i), "12");

    expect(rowValue("Tip (12%)")).toBe("$4.80");
    expect(rowValue("Total")).toBe("$44.80");
  });

  it("clamps a custom tip above 100%", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "10");
    await user.click(screen.getByRole("radio", { name: "Custom" }));
    await user.type(screen.getByLabelText(/custom tip percentage/i), "250");

    expect(rowValue("Tip (100%)")).toBe("$10.00");
    expect(rowValue("Total")).toBe("$20.00");
  });

  it("keeps a decimal typeable in the bill field", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "12.5");

    expect(billField()).toHaveValue("12.5");
    expect(rowValue("Bill")).toBe("$12.50");
  });

  it("splits an even total equally", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "100");
    await setPeople(user, "4");

    expect(rowValue("Total")).toBe("$118.00");
    expect(perPerson()).toBe("$29.50");
    expect(screen.queryByText(/uneven split/i)).not.toBeInTheDocument();
  });

  it("hands leftover pennies out one at a time so the shares sum to the total", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    // $10.00 with no tip over 3 people: 1000 cents is 333 each with 1 left over.
    await typeBill(user, "10");
    await user.click(screen.getByRole("radio", { name: "Custom" }));
    await setPeople(user, "3");

    expect(rowValue("Total")).toBe("$10.00");
    expect(perPerson()).toBe("$3.34");
    expect(
      screen.getByText(/1 person pays \$3\.34, the others pay \$3\.33/i),
    ).toBeInTheDocument();
    // 1 x 334 + 2 x 333 = 1000. No cent lost, none invented.
  });

  it("rounds the tip to a whole cent rather than carrying a fraction", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    // 15% of $33.33 is 4.9995 — it must land on $5.00, not $4.99 or $5.0045.
    await typeBill(user, "33.33");
    await user.click(screen.getByRole("radio", { name: "15%" }));

    expect(rowValue("Tip (15%)")).toBe("$5.00");
    expect(rowValue("Total")).toBe("$38.33");
  });

  it("falls back to one person when the split field is cleared", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "20");
    await user.clear(peopleField());

    expect(peopleField()).toHaveValue(null);
    expect(screen.getByLabelText(/total due/i).textContent).toBe("$23.60");
  });

  it("treats a negative or junk bill as zero", async () => {
    const user = userEvent.setup();
    render(<TipCalculator />);

    await typeBill(user, "-25");
    expect(rowValue("Bill")).toBe("$0.00");

    await typeBill(user, "abc");
    expect(rowValue("Total")).toBe("$0.00");
  });
});
