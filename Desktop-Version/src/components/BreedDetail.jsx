import { useEffect, useRef } from "react";
import Icon from "./Icon";
import TraitMeter from "./TraitMeter";
import { TRAIT_GROUPS, traitValue } from "../lib/traits";
import { em, heightRange, lifeSpan, sizeBand, weightRange } from "../lib/format";
import "./BreedDetail.css";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full breed profile in a modal dialog: every rating with its plain-English
 * sentence, plus the measurements split by sex. Implements the dialog basics
 * by hand - Escape to close, focus trapped inside, focus restored on close,
 * body scroll locked, and the backdrop click as a secondary dismiss.
 */
export default function BreedDetail({ breed, onClose }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector(".detail__close")?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []).filter(
        (node) => !node.disabled && node.offsetParent !== null
      );
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const band = sizeBand(breed);
  const life = lifeSpan(breed);

  const measurements = [
    { label: "Height, male", value: heightRange(breed, "male"), unit: "″" },
    { label: "Height, female", value: heightRange(breed, "female"), unit: "″" },
    { label: "Weight, male", value: weightRange(breed, "male"), unit: " lb" },
    { label: "Weight, female", value: weightRange(breed, "female"), unit: " lb" },
    { label: "Life expectancy", value: life, unit: " yr" },
    { label: "Size class", value: band, unit: "" },
  ];

  return (
    <div className="detail" role="presentation" onClick={onClose}>
      <div
        className="detail__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="detail__close" onClick={onClose}>
          <Icon name="close" size={18} />
          <span className="u-visually-hidden">Close breed profile</span>
        </button>

        <div className="detail__media">
          {breed.image_link ? (
            <img src={breed.image_link} alt={`${breed.name} dog`} />
          ) : (
            <div className="detail__media-fallback">
              <Icon name="photoOff" size={30} />
              <span>No photo available</span>
            </div>
          )}
        </div>

        <div className="detail__content">
          <header className="detail__header">
            {band && <p className="detail__eyebrow">{band} breed</p>}
            <h2 className="detail__title" id="detail-title">
              {breed.name}
            </h2>
          </header>

          <section className="detail__section">
            <h3 className="detail__section-title">Measurements</h3>
            <dl className="detail__measurements">
              {measurements.map((item) => (
                <div key={item.label} className="detail__measurement">
                  <dt>{item.label}</dt>
                  <dd>{item.value ? `${item.value}${item.unit}` : em}</dd>
                </div>
              ))}
            </dl>
          </section>

          {TRAIT_GROUPS.map((group) => (
            <section className="detail__section" key={group.id}>
              <h3 className="detail__section-title">{group.label}</h3>
              <div className="detail__traits">
                {group.traits.map((trait) => (
                  <TraitMeter
                    key={trait.key}
                    traitKey={trait.key}
                    label={trait.label}
                    value={traitValue(breed, trait.key)}
                    size="lg"
                    showDescription
                  />
                ))}
              </div>
            </section>
          ))}

          <p className="detail__footnote">
            Measurements follow United States standards (inches, pounds). Conversion may be
            required for international comparison.
          </p>
        </div>
      </div>
    </div>
  );
}
