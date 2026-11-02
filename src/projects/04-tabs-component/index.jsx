import { useState } from "react";
import { card, subtle, tabIdle, tabList, tabPanel, tabSelected } from "../../shared/ui.js";

const TABS = [
  {
    id: "props",
    label: "Props",
    heading: "Values the parent hands down",
    body:
      "Props arrive from whoever renders the component and are read-only inside it. They " +
      "are the component's arguments: same props in, same output out.",
  },
  {
    id: "state",
    label: "State",
    heading: "Values the component owns",
    body:
      "State is declared with useState and belongs to that instance. Setting it schedules " +
      "a re-render, which is how anything on screen ever changes.",
  },
  {
    id: "context",
    label: "Context",
    heading: "Values the whole subtree can read",
    body:
      "Context skips the prop chain for things every level needs — theme, the current " +
      "user, a locale. It is a delivery mechanism, not a state manager; something above " +
      "still has to hold the value.",
  },
  {
    id: "refs",
    label: "Refs",
    heading: "Values that change without a re-render",
    body:
      "A ref is a mutable box React keeps between renders. Writing to it renders nothing, " +
      "which makes it right for DOM nodes and timer handles and wrong for anything the " +
      "output depends on.",
  },
];

export default function TabsComponent() {
  // One index, not a selected flag per tab. "Exactly one tab is selected" then follows from
  // the shape of the state rather than from every handler remembering to clear the others.
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = TABS[selectedIndex];

  return (
    <div className={`${card} p-0`}>
      <div role="tablist" aria-label="React concepts" className={`${tabList} px-4 pt-2`}>
        {TABS.map((tab, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`${tab.id}-panel`}
              className={isSelected ? tabSelected : tabIdle}
              onClick={() => setSelectedIndex(index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Only the selected panel is mounted. The panels here hold nothing stateful, so
          there is nothing to preserve across a switch -- see the README for when keeping
          them all mounted and hidden is the better call. */}
      <div
        id={`${selected.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${selected.id}-tab`}
        className={`${tabPanel} px-6 pb-6`}
      >
        <h3 className="text-sm font-medium text-slate-900">{selected.heading}</h3>
        <p className={`${subtle} mt-2`}>{selected.body}</p>
      </div>
    </div>
  );
}
