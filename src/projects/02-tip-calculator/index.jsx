import { useState } from "react";
import {
  card,
  input,
  segmentInput,
  segmentLabel,
  statValue,
  subtle,
} from "../../shared/ui.js";

const TIP_PRESETS = [10, 15, 18, 20, 25];
const CUSTOM = "custom";
const MAX_TIP = 100;
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 50;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Built once at module scope. Constructing an Intl formatter is the expensive part;
// formatting with it is cheap.
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const money = (cents) => currency.format(cents / 100);

// Dollars are parsed to integer cents immediately and never leave that form until
// they are formatted for display. Keeping them as floats puts 0.1 + 0.2 rounding
// error inside the arithmetic, where no amount of `toFixed(2)` can get it back out.
const toCents = (text) => {
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
};

// Divide `cents` across `people` so the shares add back up to exactly `cents`.
// The leftover pennies cannot be split, so `extra` people pay one more than the rest.
function splitCents(cents, people) {
  const low = Math.floor(cents / people);
  const extra = cents % people;
  return { low, high: extra > 0 ? low + 1 : low, extra };
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={subtle}>{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-slate-900">{value}</dd>
    </div>
  );
}

export default function TipCalculator() {
  // Every amount is held as the raw text the user typed, never as a number. A numeric
  // state round-trips "12." into 12 and re-renders the field without the dot, which
  // makes a decimal impossible to type.
  const [billText, setBillText] = useState("");
  const [tipChoice, setTipChoice] = useState("18");
  const [customTipText, setCustomTipText] = useState("");
  const [peopleText, setPeopleText] = useState("1");

  // Everything below is derived on each render. None of it is stored, so no result can
  // disagree with the inputs it came from.
  const billCents = toCents(billText);
  const tipPercent =
    tipChoice === CUSTOM
      ? clamp(Number(customTipText) || 0, 0, MAX_TIP)
      : Number(tipChoice);
  const people = clamp(
    Math.floor(Number(peopleText)) || MIN_PEOPLE,
    MIN_PEOPLE,
    MAX_PEOPLE,
  );

  const tipCents = Math.round((billCents * tipPercent) / 100);
  const totalCents = billCents + tipCents;
  const { low, high, extra } = splitCents(totalCents, people);

  return (
    <div className={`${card} space-y-6`}>
      <label className="block">
        <span className={subtle}>Bill amount</span>
        <input
          className={`${input} mt-1`}
          inputMode="decimal"
          placeholder="0.00"
          value={billText}
          onChange={(event) => setBillText(event.target.value)}
        />
      </label>

      <fieldset>
        <legend className={subtle}>Tip</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIP_PRESETS.map((percent) => (
            <div key={percent}>
              <input
                className={segmentInput}
                type="radio"
                name="tip"
                id={`tip-${percent}`}
                value={String(percent)}
                checked={tipChoice === String(percent)}
                onChange={(event) => setTipChoice(event.target.value)}
              />
              <label className={segmentLabel} htmlFor={`tip-${percent}`}>
                {percent}%
              </label>
            </div>
          ))}
          <div>
            <input
              className={segmentInput}
              type="radio"
              name="tip"
              id="tip-custom"
              value={CUSTOM}
              checked={tipChoice === CUSTOM}
              onChange={(event) => setTipChoice(event.target.value)}
            />
            <label className={segmentLabel} htmlFor="tip-custom">
              Custom
            </label>
          </div>
        </div>

        {tipChoice === CUSTOM && (
          <label className="mt-3 block">
            <span className={subtle}>Custom tip percentage (0&ndash;{MAX_TIP})</span>
            <input
              className={`${input} mt-1`}
              inputMode="decimal"
              placeholder="0"
              value={customTipText}
              onChange={(event) => setCustomTipText(event.target.value)}
            />
          </label>
        )}
      </fieldset>

      <label className="block">
        <span className={subtle}>
          Split between ({MIN_PEOPLE}&ndash;{MAX_PEOPLE} people)
        </span>
        <input
          className={`${input} mt-1`}
          type="number"
          min={MIN_PEOPLE}
          max={MAX_PEOPLE}
          value={peopleText}
          onChange={(event) => setPeopleText(event.target.value)}
        />
      </label>

      <div aria-live="polite" className="border-t border-slate-200 pt-6">
        <p className={subtle} id="per-person-label">
          {people === 1 ? "Total due" : "Per person"}
        </p>
        <p aria-labelledby="per-person-label" className={`${statValue} mt-1`}>
          {money(high)}
        </p>

        {extra > 0 && (
          <p className={`${subtle} mt-2`}>
            Uneven split: {extra} {extra === 1 ? "person pays" : "people pay"}{" "}
            {money(high)}, the other {people - extra === 1 ? "one pays" : "ones pay"}{" "}
            {money(low)}.
          </p>
        )}

        <dl className="mt-6 space-y-2">
          <Row label="Bill" value={money(billCents)} />
          <Row label={`Tip (${tipPercent}%)`} value={money(tipCents)} />
          <Row label="Total" value={money(totalCents)} />
        </dl>
      </div>
    </div>
  );
}
