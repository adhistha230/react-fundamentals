# Tip Calculator

A bill splitter: enter the bill, pick a tip percentage, choose how many people are paying.

## What it demonstrates

**Money is integer cents, not floats.** This is the whole point of the project. The obvious
implementation keeps the bill as a float and rounds on the way out:

```js
const tip = bill * (percent / 100);
const perPerson = (bill + tip) / people;
// perPerson.toFixed(2)
```

Two separate things are wrong with it. The first is the familiar one — `0.1 + 0.2` is
`0.30000000000000004`, and real bills hit this (`16.1 * 3` is `48.300000000000004`). The
second is worse because `toFixed` hides it: rounding each output *independently* means the
parts stop adding up to the whole. $10.00 across three people formats as `$3.33` three
times, which is $9.99. A penny vanished.

So the bill is parsed to cents once, at the boundary (`toCents`), every calculation is
integer arithmetic, and the conversion back to dollars happens only inside `money()` for
display. Rounding occurs at exactly one place per value — `Math.round` on the tip — rather
than at every point where a number is printed.

**Remainders are distributed, not rounded away.** `splitCents` divides with `Math.floor`
and then counts the leftover with `%`. If 1000 cents go three ways, one person pays 334 and
two pay 333. The shares sum back to the total exactly, and the UI says so out loud instead
of quietly showing a figure that doesn't reconcile. The headline number is the *higher*
share, because the failure mode of showing the lower one is a table that under-collects.

**Derived values, not stored ones.** There is no `useState` for the tip, the total, or the
per-person amount. All four results are recomputed during render from the four input
states. Storing them would mean four more values that can disagree with the inputs, plus
effects to keep them synced — the bug this avoids is the one where the bill changes and the
total doesn't.

**Text state for numeric fields.** `billText` is a string. With numeric state, typing
`12.50` breaks at the decimal point: `Number("12.")` is `12`, so the field re-renders as
`12` and the dot can never be entered. Keeping the raw text and deriving the number from it
lets the field hold an in-progress value while the computed amount stays valid. (Project 01
hits the same wall from a different direction — there the problem was a field that couldn't
be cleared.)

**A segmented control made of radios.** The tip presets are a real radio group inside a
`<fieldset>` with a `<legend>`, styled with `peer-checked:` from a visually-hidden input.
Arrow-key navigation, the single tab stop, and group semantics all come from the browser.
The version built from `<button>`s looks identical and then needs a keydown handler,
`role="radiogroup"`, `aria-checked`, and roving `tabindex` to catch up.

## Notes

The `Intl.NumberFormat` instance is created once at module scope rather than per render —
constructing a formatter is the costly part, formatting with it is not.

The results region is `aria-live="polite"`, so changing the bill or the split announces the
new per-person figure, and the big readout is tied to its own label with `aria-labelledby`
so it isn't announced as a bare number.

Clamping is applied in the derivation (`clamp`), not left to the `min`/`max` attributes —
those are browser hints, and a pasted value can sail straight past them.
