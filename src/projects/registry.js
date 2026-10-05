import Counter from "./01-counter-with-steps/index.jsx";

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
];
