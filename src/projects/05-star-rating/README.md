# Star Rating

A five-star rating with half-star precision, built on ten real radio inputs. Hovering
previews a rating without committing it; clicking or pressing Space commits one.

## What it demonstrates

**Two pieces of state, not one.** `value` is what the user committed, `preview` is where the
pointer happens to be, and keeping them apart is the entire widget. The tempting version
stores one rating and sets it on hover — which works right up until the pointer leaves, at
which point the last star the mouse happened to cross on its way off the row has become the
user's answer. Every render paints `preview ?? value`, so the preview can be as transient as
the pointer is while the committed value sits still underneath it.

The read is `??` rather than `||` deliberately. `null` means "not hovering", which is a
different fact from "hovering a rating of zero". The second cannot currently occur, since the
lowest input is 0.5 — but if a zero-rating half were ever added, `||` would silently fall
through to `value` and the preview would stop working for exactly one position.

**Native radio semantics, so the keyboard behaviour isn't ours to write.** The ten inputs
share a `name`, which is all it takes to get, for free: one tab stop for the whole group,
arrow keys moving the selection, Space committing, "3.5 stars, selected, 7 of 10" announced
by a screen reader, and the guarantee that exactly one value is selected. A `div` with
`role="radiogroup"` and ten `role="radio"` children would need a roving tabindex, a key
handler, and `aria-checked` bookkeeping to reach the same place, and would still be a
reimplementation of something the platform ships.

The inputs are `sr-only` rather than `display: none` or `opacity: 0` — hidden to the eye,
present to the focus order. An input removed from the layout is removed from the tab order
too, which takes the keyboard support with it.

**Ten inputs, not five.** This is the half-star trade-off. There is no half-checked radio to
borrow, so a half-star scale needs one input per reachable position, and each star becomes
two stacked hit regions — left half for `x.5`, right half for `x.0`. The cost is that arrow
keys now step in halves, so crossing the scale takes ten presses instead of five. For a
five-star widget that is fine. For a ten-star one it would not be, and the fix would be a
slider (`role="slider"` with `aria-valuenow`), which trades the radio group's crisp "one of
these" semantics for a continuous range.

**The fill is a clipped copy of the same glyph.** Each star renders twice: a grey one, and an
amber one inside a wrapper whose width is `0%`, `50%` or `100%`. Clipping the wrapper rather
than scaling the star keeps the point geometry intact, which is what makes a half star read
as half of *this* star rather than as a smaller whole one. The percentage comes from
`fillPercent`, derived per render, so the painting cannot disagree with the value it came
from.

**A commit supersedes the preview.** Pointer and keyboard are independent inputs, and a stale
preview outranks the value it is meant to be previewing: park the mouse on star 3, then arrow
right, and the readout keeps showing 3 while the group reports 3.5. So `commit` clears
`preview` as well as setting `value`. On a click it changes nothing — the half being
committed is the half under the pointer — which is why the bug only appears on the mixed
path, and why it survived until a keyboard test went looking for it.

## Notes

The readout is `aria-hidden`. The radio group already announces the rating on selection, so
anything live here would double every reading, and the preview it tracks is a pointer-only
affordance with nothing to announce in the first place. The visible label flips between "Your
rating" and "Preview" so sighted users can tell a hover from a commitment.

"Clear rating" is not decoration. Once a radio in a group is checked, no key unchecks it —
the arrows only move the selection — so without the button the unrated state is reachable
exactly once, before the first click. It is disabled when there is nothing to clear.

The preview is cleared by one handler on the `fieldset` rather than by a leave handler on each
half. Moving between two adjacent halves fires a leave for one and an enter for the other in
an order we would otherwise have to reason about; letting the group own the exit makes the
order irrelevant.

The group `name` comes from `useId()`. Two of these on one page with a hardcoded name are one
radio group, and selecting in either clears the other.

Hover is pointer-only by nature, so the preview never appears for keyboard or touch users.
That is the honest behaviour rather than a gap: both of those paths commit directly, and
neither has a notion of "pointing at something without choosing it".
