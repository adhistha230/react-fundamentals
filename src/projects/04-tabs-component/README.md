# Tabs Component

A horizontal tablist following the ARIA tabs pattern: arrow keys move between tabs, Home and
End jump to the ends, and the whole group is a single stop in the Tab order.

## What it demonstrates

**Index state instead of a flag per tab.** The selection is one number. "Exactly one tab is
selected" is therefore a property of the state's shape — there is nowhere to record a second
selected tab — rather than a rule each handler has to remember to enforce by clearing the
others.

**Roving tabindex.** This is the part that is easy to get wrong, because the wrong version
works. Give every tab the default tab order and the component still functions: Tab steps onto
each one, Enter activates it. But a sighted keyboard user then pays four presses to cross a
four-tab bar, and with twenty tabs the bar becomes a wall between them and the page below.

The pattern instead treats the tablist as *one* widget: the selected tab has `tabIndex={0}`,
the rest `-1`, so Tab enters the group and the next Tab leaves it. Movement inside is the
arrow keys' job. Because `-1` removes an element from the tab order without removing it from
the focusable set, the component can still focus it programmatically — which is exactly what
the arrow handler does, and why the roving tabindex and the imperative `.focus()` are two
halves of one mechanism rather than two separate features.

**Focus moved imperatively, through refs.** Everything else here is declarative, but focus
is not React state — it is a property of the document, and only one element in the page has
it. So `selectAt` calls `.focus()` on the target node directly. Refs are collected in a
`useRef([])` array via a ref callback rather than queried out of the DOM, which keeps the
component correct when it is rendered more than once on a page.

**Automatic activation.** Arrowing onto a tab selects it, rather than only focusing it and
waiting for Enter or Space. The APG allows both, and the deciding question is what the panel
costs: if revealing it is cheap, selection-follows-focus is fewer keystrokes and no surprise.
If each panel fetches data, automatic activation fires a request per tab the user arrows
across, and manual activation — `aria-selected` lagging focus until Enter — is the better
trade. These panels are static text, so automatic wins.

**A modulo for the wrap.** `(index + TABS.length) % TABS.length` means the arrow handler
needs no bounds checks: the only out-of-range values it can produce are one step past either
end, and the modulo folds both back in. The key map is read with `=== undefined` rather than
a truthiness test, because `Home` maps to `0`.

**One handler on the list, not four on the buttons.** A key press always arrives at the
focused tab, which is the selected one, so the handler can read `selectedIndex` instead of
needing to know which button was pressed.

## Notes

The panel carries `tabIndex={0}`. It holds no focusable content, so without it the Tab key
would step from the tablist straight past the thing the tabs just revealed. A panel with a
link or a field inside it does not need this.

Only the selected panel is mounted. That is fine here because the panels are static, but it
is a real decision: an unmounted panel loses its state, so a tab containing a half-filled
form wants all panels mounted with `hidden` on the inactive ones. The `hidden` version costs
initial render time for content nobody has asked for yet, which is why it isn't the default.

Only `ArrowLeft` and `ArrowRight` are handled, since this tablist is horizontal; the vertical
orientation uses up and down instead. Handling all four looks generous but tells a screen
reader user the wrong thing about which way the widget runs.
