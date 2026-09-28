import { TRAIT_MAX, traitDescription } from "../lib/traits";
import "./TraitMeter.css";

/**
 * A 0-5 rating as segmented bars. Segments beat dots here because the filled
 * width is readable at a glance, and the sentence stays available as text
 * rather than hiding in a title attribute a keyboard user can never reach.
 */
export default function TraitMeter({ traitKey, label, value, showDescription = false, size = "md" }) {
  const description = traitDescription(traitKey, value);
  const isRated = value !== null;

  return (
    <div className={`meter meter--${size}`} data-unrated={!isRated || undefined}>
      <div className="meter__head">
        <span className="meter__label">{label}</span>
        <span className="meter__value">{isRated ? `${value}/${TRAIT_MAX}` : "n/a"}</span>
      </div>

      <div
        className="meter__track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={TRAIT_MAX}
        aria-valuenow={isRated ? value : undefined}
        aria-valuetext={description}
        aria-label={label}
      >
        {Array.from({ length: TRAIT_MAX }).map((_, index) => (
          <span
            key={index}
            className="meter__segment"
            data-filled={isRated && index < value ? "" : undefined}
          />
        ))}
      </div>

      {showDescription && <p className="meter__description">{description}</p>}
    </div>
  );
}
