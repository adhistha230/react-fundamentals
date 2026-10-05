import { useState } from "react";
import { buttonGhost, buttonPrimary, card, input, subtle } from "../../shared/ui.js";

const MIN = 0;
const MAX = 100;
const STEP_MIN = 1;
const STEP_MAX = 25;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export default function Counter() {
  const [count, setCount] = useState(0);

  // Held as text, not as a number. A numeric state with a `Number(v) || 1` fallback
  // can never be empty, which makes the field impossible to clear and silently
  // rewrites what the user typed.
  const [stepText, setStepText] = useState("1");

  // All three derived on every render rather than stored in their own state, so they
  // cannot drift out of sync with the values they come from.
  const step = clamp(Number(stepText) || STEP_MIN, STEP_MIN, STEP_MAX);
  const atMin = count === MIN;
  const atMax = count === MAX;

  return (
    <div className={`${card} space-y-6`}>
      <div>
        <p className={subtle}>Count</p>
        <p
          aria-live="polite"
          className="mt-1 text-5xl font-semibold tabular-nums text-slate-900"
        >
          {count}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={buttonGhost}
          aria-label={`Subtract ${step}`}
          disabled={atMin}
          onClick={() => setCount((c) => clamp(c - step, MIN, MAX))}
        >
          &minus;{step}
        </button>
        <button
          className={buttonPrimary}
          aria-label={`Add ${step}`}
          disabled={atMax}
          onClick={() => setCount((c) => clamp(c + step, MIN, MAX))}
        >
          +{step}
        </button>
        <button className={buttonGhost} disabled={count === 0} onClick={() => setCount(0)}>
          Reset
        </button>
      </div>

      <label className="block">
        <span className={subtle}>
          Step size ({STEP_MIN}&ndash;{STEP_MAX})
        </span>
        <input
          className={`${input} mt-1`}
          type="number"
          min={STEP_MIN}
          max={STEP_MAX}
          value={stepText}
          onChange={(event) => setStepText(event.target.value)}
        />
      </label>

      <p className={subtle}>
        Clamped to {MIN}&ndash;{MAX}.{atMax ? " At maximum." : atMin ? " At minimum." : ""}
      </p>
    </div>
  );
}
