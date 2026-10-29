import Counter from "./01-counter-with-steps/index.jsx";
import TipCalculator from "./02-tip-calculator/index.jsx";
import AccordionFaq from "./03-accordion-faq/index.jsx";

// Single source of truth for the index page and the router. Adding a project means
// adding one entry here.
export const projects = [
  {
    slug: "01-counter-with-steps",
    name: "Counter with Steps",
    difficulty: "S",
    teaches: ["useState", "derived state", "clamping"],
    Component: Counter,
  },
  {
    slug: "02-tip-calculator",
    name: "Tip Calculator",
    difficulty: "S",
    teaches: ["controlled numeric inputs", "integer-cent money math"],
    Component: TipCalculator,
  },
  {
    slug: "03-accordion-faq",
    name: "Accordion FAQ",
    difficulty: "S",
    teaches: ["conditional rendering", "single-open logic"],
    Component: AccordionFaq,
  },
];
