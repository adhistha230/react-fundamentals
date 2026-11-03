import { useId, useState } from "react";
import { card, hiddenInput, starFill, starHit, starTrack, statValue, subtle } from "../../shared/ui.js";

const STARS = 5;
const STEP = 0.5;

const labelFor = (value) => `${value} ${value === 1 ? "star" : "stars"}`;

// How much of star `index` a rating of `shown` fills: star 3 at 3.5 is half full, and
// every star below it is whole. Derived per render, so the painting cannot disagree with
// the value it came from.
const fillPercent = (index, shown) => Math.min(100, Math.max(0, (shown - index) * 100));

function Star({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-10 w-10 ${className}`}>
      <path
        fill="currentColor"
        d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.56l-5.9 3.1 1.13-6.56L2.45 9.44l6.6-.96z"
      />
    </svg>
  );
}

export default function StarRating() {
  // Two separate pieces of state, and that separation is the whole widget. `value` is what
  // the user has committed; `preview` is where the pointer happens to be. Collapsing them
  // into one -- setting the rating on hover -- means the last star the mouse crossed on its
  // way off the row becomes the answer.
  const [value, setValue] = useState(0);
  const [preview, setPreview] = useState(null);

  // Null means "not hovering", which is distinct from hovering a rating of zero -- a state
  // that cannot occur, since the lowest input is 0.5. `??` keeps it that way anyway: `||`
  // would quietly fall through to `value` if a zero preview were ever introduced.
  const shown = preview ?? value;

  // The group name has to be unique per instance, or two ratings on one page become one
  // radio group and selecting in either clears the other.
  const groupName = useId();

  return (
    <div className={`${card} space-y-6`}>
      {/* The preview is cleared on the fieldset, not on each label. Moving between two
          halves fires a leave for the one and an enter for the other in an order we would
          otherwise have to reason about; letting the group own the exit makes the order
          irrelevant. */}
      <fieldset onMouseLeave={() => setPreview(null)}>
        <legend className={subtle}>Rate this</legend>

        <div className="mt-2 flex gap-1">
          {Array.from({ length: STARS }, (_, index) => (
            <span key={index} className="relative block h-10 w-10">
              <Star className={`absolute left-0 top-0 ${starTrack}`} />

              {/* The fill is one clipped copy of the same glyph. Clipping the wrapper
                  rather than scaling the star keeps the point geometry intact, which is
                  what makes a half star read as half of this star and not a smaller one. */}
              <span
                aria-hidden="true"
                data-star-fill={fillPercent(index, shown)}
                className="absolute left-0 top-0 h-10 overflow-hidden"
                style={{ width: `${fillPercent(index, shown)}%` }}
              >
                <Star className={starFill} />
              </span>

              {/* Two inputs per star, ten in all -- a half-star scale has ten reachable
                  positions, and a radio group needs one input per position. There is no
                  half-checked radio to borrow. */}
              {[index + STEP, index + 1].map((starValue, half) => (
                <span
                  key={starValue}
                  className={`absolute inset-y-0 w-1/2 ${half === 0 ? "left-0" : "right-0"}`}
                >
                  <input
                    className={hiddenInput}
                    type="radio"
                    name={groupName}
                    id={`${groupName}-${starValue}`}
                    value={starValue}
                    checked={value === starValue}
                    onChange={() => setValue(starValue)}
                  />
                  {/* Empty to the eye -- the stars underneath are the visuals. The text is
                      the input's accessible name, so it has to be present, not decorative. */}
                  <label
                    htmlFor={`${groupName}-${starValue}`}
                    className={starHit}
                    onMouseEnter={() => setPreview(starValue)}
                  >
                    <span className="sr-only">{labelFor(starValue)}</span>
                  </label>
                </span>
              ))}
            </span>
          ))}
        </div>
      </fieldset>

      {/* Hidden from assistive tech on purpose. The radio group already announces the
          rating on selection, so a live region here would double every reading -- and the
          preview it tracks is a pointer-only affordance with nothing to announce. */}
      <div aria-hidden="true">
        <p className={subtle}>{preview === null ? "Your rating" : "Preview"}</p>
        <p className={`${statValue} mt-1`}>
          {shown}
          <span className="ml-2 text-base font-normal text-slate-400">of {STARS}</span>
        </p>
      </div>
    </div>
  );
}
