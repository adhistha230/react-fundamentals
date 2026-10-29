# react-fundamentals

Small React projects covering the fundamentals: JSX, props, state, lists, controlled forms
and conditional rendering. One project per concept, each with tests and a short write-up of
what it demonstrates.

Part of a six-repo set — see also `react-hooks`, `react-api-projects`,
`react-state-routing`, `react-ui-components`, `react-mini-apps`.

## Projects

| # | Project | Size | Demonstrates |
|---|---------|------|--------------|
| 01 | [Counter with Steps](src/projects/01-counter-with-steps/) | S | `useState`, derived state, clamping |
| 02 | [Tip Calculator](src/projects/02-tip-calculator/) | S | controlled numeric inputs, integer-cent money math |

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · React Router 7 · Vitest + React Testing Library

## Running it

```bash
npm install
npm run dev      # dev server
npm test         # run the test suite
npm run build    # production build
```

Each project is a route off the index page. `src/projects/registry.js` is the single source
of truth for both the index listing and the router.

## Layout

```
src/
  App.jsx                  index page + routes
  shared/ui.js             Tailwind compositions reused across projects
  projects/
    registry.js            project metadata
    NN-<slug>/
      index.jsx            the project
      README.md            what it demonstrates
      *.test.jsx           its tests
```
