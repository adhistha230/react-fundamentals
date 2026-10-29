# Accordion FAQ

Five questions, at most one answer open at a time, and clicking the open question closes
it.

## What it demonstrates

**Make the invariant unrepresentable.** The requirement is "at most one panel is open".
The tempting shape is a boolean per item:

```js
const [open, setOpen] = useState(faqs.map(() => false));
// now every handler must remember to close the others
```

That state can represent three open panels. Nothing stops it, so the rule has to be
re-enforced in every code path that ever writes to it — and a future "expand all" button
added by someone who didn't read the handler silently breaks it. Holding a single
`openId` instead means a second open panel has nowhere to live:

```js
const [openId, setOpenId] = useState(null);
const toggle = (id) => setOpenId((current) => (current === id ? null : id));
```

The invariant now comes from the *shape* of the state rather than the discipline of the
code that writes it. `null` is what makes all-closed reachable; using the first item's id
as the initial value would make "nothing open" unrepresentable instead.

**Conditional rendering, and when not to use it.** Closed panels are `{isOpen && ...}` —
genuinely absent from the DOM, not hidden with CSS. For static prose that is the better
default: the DOM stays small, and there is no invisible-but-focusable content for keyboard
users to tab into, which is the classic `display: none`-forgotten bug.

It is the wrong default as soon as a panel holds anything stateful. Unmounting destroys
component state, so a half-filled form inside a panel is wiped by collapsing it, and
scroll position inside the panel resets. Browser find-in-page can't match text that isn't
there either. When any of that matters, keep the panel mounted and toggle the `hidden`
attribute — `hidden` (unlike a stray `visibility` rule) also removes the content from the
accessibility tree and the tab order, which is why it's the right tool and `opacity: 0`
is not.

**`aria-expanded` is the state; the icon is decoration.** The trigger carries
`aria-expanded`, which is what a screen reader announces as collapsed/expanded. The `+`/`−`
glyph is therefore `aria-hidden` — without it, the announcement becomes "plus, What is the
difference…, collapsed", stating the same fact twice.

`aria-controls` points at the panel, and the panel points back with `aria-labelledby`, so
the region is announced by its question rather than as an unnamed region.

**Buttons, so the keyboard comes for free.** Each trigger is a real `<button>` wrapped in
an `<h3>`. The button gives Enter and Space activation and a tab stop with no handler of
our own; the heading lets screen reader users jump question to question by heading instead
of tabbing through all five. A `<div onClick>` would need `role="button"`, `tabIndex`, and
a keydown handler to reach the same place, and would still be missing from heading
navigation.

The ARIA Authoring Practices guide lists arrow-key movement between accordion headers as
optional, and it is deliberately not implemented here — adding it means taking over focus
management, and the native tab order already works.

## Notes

The container uses `divide-y` for the separators rather than a border per item, which
avoids the doubled border where two items meet.

Panel ids are derived from each FAQ's own `id` field, not from the array index, so the
`aria-controls` wiring survives the list being reordered.
