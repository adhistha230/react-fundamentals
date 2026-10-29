import { useState } from "react";
import {
  card,
  input,
  segmentInput,
  segmentLabel,
  subtle,
} from "../../shared/ui.js";

const TIP_PRESETS = [10, 15, 18, 20, 25];
const CUSTOM = "custom";
const MAX_TIP = 100;
const MIN_PEOPLE = 1;
const MAX_PEOPLE = 50;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export default function TipCalculator() {
  // Every amount is held as the raw text the user typed, never as a number. A numeric
  // state round-trips "12." into 12 and re-renders the field without the dot, which
  // makes a decimal impossible to type.
  const [billText, setBillText] = useState("");
  const [tipChoice, setTipChoice] = useState("18");
  const [customTipText, setCustomTipText] = useState("");
  const [peopleText, setPeopleText] = useState("1");

  const tipPercent =
    tipChoice === CUSTOM
      ? clamp(Number(customTipText) || 0, 0, MAX_TIP)
      : Number(tipChoice);
  const people = clamp(
    Math.floor(Number(peopleText)) || MIN_PEOPLE,
    MIN_PEOPLE,
    MAX_PEOPLE,
  );

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

      <p className={subtle}>
        {tipPercent}% tip, split {people} {people === 1 ? "way" : "ways"}.
      </p>
    </div>
  );
}
