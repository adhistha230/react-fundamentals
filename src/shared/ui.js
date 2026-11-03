// Shared Tailwind compositions. Keeping them here means the six topic repos read as one
// body of work, and each project file stays focused on its React concept rather than styling.

const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium " +
  "transition disabled:cursor-not-allowed disabled:opacity-40";

export const buttonPrimary = `${buttonBase} bg-slate-900 text-white hover:bg-slate-700`;
export const buttonGhost = `${buttonBase} border border-slate-300 text-slate-700 hover:bg-slate-100`;

export const card = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";
export const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm " +
  "focus:border-slate-900 focus:outline-none";
export const heading = "text-2xl font-semibold tracking-tight text-slate-900";
export const subtle = "text-sm text-slate-500";
export const statValue = "text-5xl font-semibold tabular-nums text-slate-900";

// Tabs. The idle and selected variants differ only in the bottom border and text colour,
// so they share a base and the component picks one — no conditional class soup inline.
export const tabList = "flex gap-1 border-b border-slate-200";

const tabBase =
  "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition " +
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-400";

export const tabIdle = `${tabBase} border-transparent text-slate-500 hover:text-slate-900`;
export const tabSelected = `${tabBase} border-slate-900 text-slate-900`;
export const tabPanel =
  "px-1 py-5 focus-visible:outline-2 focus-visible:-outline-offset-2 " +
  "focus-visible:outline-slate-400";

// A real input, visually hidden but still focused and tabbed to, so arrow-key selection
// within a radio group is the platform's job rather than ours. `peer` only reaches forward,
// so the label it styles must follow it, and the pair needs its own wrapper element —
// `peer-*` is a general-sibling selector, and two pairs under one parent cross-match.
export const hiddenInput = "peer sr-only";

// A segmented control built on real radio inputs.
export const segmentInput = hiddenInput;
export const segmentLabel =
  "inline-block cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm " +
  "font-medium text-slate-700 transition hover:bg-slate-100 " +
  "peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400";

// Star rating. The hit area is a transparent label stretched over half a star; the focus
// ring lands on it rather than on the whole star, so it shows which half is focused.
export const starHit =
  "block h-full w-full cursor-pointer rounded-sm " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400";
export const starTrack = "text-slate-200";
export const starFill = "text-amber-400";
