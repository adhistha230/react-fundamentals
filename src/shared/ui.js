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

// A segmented control built on real radio inputs. The input is visually hidden but still
// focused and tabbed to, so arrow-key selection within the group is the platform's job
// rather than ours. `peer` only reaches forward, so the label must follow its input.
export const segmentInput = "peer sr-only";
export const segmentLabel =
  "inline-block cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm " +
  "font-medium text-slate-700 transition hover:bg-slate-100 " +
  "peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400";
