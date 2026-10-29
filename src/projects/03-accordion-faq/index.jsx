import { useState } from "react";
import { card, subtle } from "../../shared/ui.js";

const FAQS = [
  {
    id: "state-vs-props",
    question: "What is the difference between state and props?",
    answer:
      "Props are passed in by whoever renders the component, and the component may not " +
      "change them. State is owned by the component and changing it triggers a re-render. " +
      "If a value arrives from outside and is never modified, it is a prop; if the " +
      "component decides it, it is state.",
  },
  {
    id: "derived-state",
    question: "Should a value computed from other state be stored in state?",
    answer:
      "Usually no. Computing it during render means it can never disagree with the values " +
      "it came from. Storing it adds a second source of truth that has to be kept in sync, " +
      "which is where the stale-total class of bug comes from.",
  },
  {
    id: "keys",
    question: "Why does React want a key on every list item?",
    answer:
      "Keys tell React which item is which between renders, so it can move DOM nodes " +
      "instead of rebuilding them. Using the array index as the key works only while the " +
      "list never reorders — otherwise React matches the wrong item and component state " +
      "ends up attached to the wrong row.",
  },
  {
    id: "controlled-inputs",
    question: "What makes an input controlled?",
    answer:
      "Passing both value and onChange. React then owns what the field displays, so the " +
      "field and the state cannot drift apart. Pass value without onChange and the input " +
      "becomes read-only, which React warns about.",
  },
  {
    id: "effects",
    question: "Does transforming data for display need useEffect?",
    answer:
      "No. An effect that sets state from other state runs after the render that already " +
      "painted the stale value, producing a second render and a visible flash. Transform " +
      "the data inline instead. Effects are for synchronising with things outside React.",
  },
];

export default function AccordionFaq() {
  // One id, not a boolean per item. "At most one panel is open" is then a property of the
  // shape of the state rather than a rule the click handler has to remember to enforce:
  // there is nowhere to record a second open panel. `null` means all closed.
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <div className={`${card} divide-y divide-slate-200 p-0`}>
      {FAQS.map((faq) => {
        const isOpen = faq.id === openId;

        return (
          <div key={faq.id}>
            <h3>
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left
                  text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                onClick={() => toggle(faq.id)}
              >
                {faq.question}
                <span aria-hidden="true" className="text-lg leading-none text-slate-400">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>

            {/* Unmounted rather than hidden while closed -- see this project's README for
                why that is the right call here and when it is not. */}
            {isOpen && (
              <div className="px-6 pb-5">
                <p className={subtle}>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
