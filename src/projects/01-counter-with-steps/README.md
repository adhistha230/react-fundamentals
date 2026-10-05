# Counter with Steps

A counter whose increment size is user-controlled, clamped to a 0–100 range.

## What it demonstrates

**Functional state updates.** Both buttons call `setCount((c) => ...)` rather than
`setCount(count + step)`. The updater form reads the value React is about to commit, so
rapid clicks can't read a stale `count` from the closure.

**Derived state instead of stored state.** `atMin` and `atMax` are recomputed on every
render from `count`. Holding them in their own `useState` would create a second source of
truth that has to be kept in sync — a bug waiting to happen.

**Clamping at the boundary, not at the button.** `clamp()` wraps the arithmetic, so a step
of 25 from a count of 90 lands on 100 rather than 115. Disabling the button is only a
UI affordance; correctness lives in the state update. The same applies to the step field:
`min`/`max` on an `<input>` are hints the browser may or may not enforce, so the 1–25 bound
is applied in `clamp()` too.

**Text state for a numeric field.** `stepText` is a string, not a number. The obvious
version — numeric state with `setStep(Number(e.target.value) || 1)` — has a bug worth
understanding: the fallback means the field can never hold an empty string, so clearing it
instantly snaps back to `1` and anything typed next is *appended* rather than replacing.
Selecting all and typing `25` yields `125`. Keeping the raw text in state and deriving the
number from it lets the field be empty mid-edit while the step stays valid.

## Notes

The count is `aria-live="polite"` so screen readers announce changes, and each arithmetic
button carries an `aria-label` describing the operation at the current step size — the
visible `+25` is ambiguous without it.
