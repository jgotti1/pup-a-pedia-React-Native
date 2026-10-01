import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { TRAIT_GROUPS, TRAIT_MAX, traitDescription, traitValue } from "../lib/traits";
import { em, heightRange, lifeSpan, sizeBand, weightRange } from "../lib/format";
import { breedId } from "../hooks/useCompare";
import "./CompareView.css";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const MEASUREMENTS = [
  { label: "Size class", get: (b) => sizeBand(b) },
  { label: "Life expectancy", get: (b) => (lifeSpan(b) ? `${lifeSpan(b)} yr` : null) },
  { label: "Height, male", get: (b) => (heightRange(b, "male") ? `${heightRange(b, "male")}″` : null) },
  { label: "Height, female", get: (b) => (heightRange(b, "female") ? `${heightRange(b, "female")}″` : null) },
  { label: "Weight, male", get: (b) => (weightRange(b, "male") ? `${weightRange(b, "male")} lb` : null) },
  { label: "Weight, female", get: (b) => (weightRange(b, "female") ? `${weightRange(b, "female")} lb` : null) },
];

/** True when every breed shares the same value - nothing to learn from the row. */
const isUniform = (values) => values.every((value) => value === values[0]);

/**
 * Side-by-side comparison. Breeds are columns and attributes are rows, which is
 * the orientation that lets the eye scan one attribute across every candidate.
 */
export default function CompareView({ breeds, onRemove, onClose }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [differencesOnly, setDifferencesOnly] = useState(false);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector(".compare__close")?.focus();

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

  // Dropping to a single breed makes a comparison meaningless.
  useEffect(() => {
    if (breeds.length < 2) onClose();
  }, [breeds.length, onClose]);

  const measurementRows = useMemo(
    () =>
      MEASUREMENTS.map((row) => {
        const values = breeds.map((breed) => row.get(breed));
        return { ...row, values, uniform: isUniform(values) };
      }),
    [breeds]
  );

  const traitGroups = useMemo(
    () =>
      TRAIT_GROUPS.map((group) => ({
        ...group,
        rows: group.traits.map((trait) => {
          const values = breeds.map((breed) => traitValue(breed, trait.key));
          return { trait, values, uniform: isUniform(values) };
        }),
      })),
    [breeds]
  );

  const hiddenCount =
    measurementRows.filter((row) => row.uniform).length +
    traitGroups.reduce((total, group) => total + group.rows.filter((row) => row.uniform).length, 0);

  const visibleRow = (row) => !differencesOnly || !row.uniform;

  return (
    <div className="compare" role="presentation" onClick={onClose}>
      <div
        className="compare__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="compare__header">
          <div>
            <p className="compare__eyebrow">Side by side</p>
            <h2 className="compare__title" id="compare-title">
              Comparing {breeds.length} breeds
            </h2>
          </div>

          <div className="compare__header-actions">
            <label className="compare__toggle">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(event) => setDifferencesOnly(event.target.checked)}
              />
              <span>Only show differences</span>
              {hiddenCount > 0 && <span className="compare__toggle-count">{hiddenCount}</span>}
            </label>

            <button type="button" className="compare__close" onClick={onClose}>
              <Icon name="close" size={18} />
              <span className="u-visually-hidden">Close comparison</span>
            </button>
          </div>
        </header>

        <div className="compare__scroll">
          <table className="compare__table" style={{ "--cols": breeds.length }}>
            <caption className="u-visually-hidden">
              Breed attributes compared across {breeds.length} breeds
            </caption>

            <thead>
              <tr>
                <th scope="row" className="compare__corner">
                  <span className="u-visually-hidden">Attribute</span>
                </th>
                {breeds.map((breed) => (
                  <th scope="col" className="compare__breed" key={breedId(breed)}>
                    {/* No photo here: it never loaded reliably inside this
                        sideways-scrolling modal on iOS Safari, and a photo
                        header ate the vertical space the data rows need -
                        especially in landscape, where it left zero rows
                        visible. The name alone identifies the column. */}
                    <span className="compare__breed-name">{breed.name}</span>
                    <button
                      type="button"
                      className="compare__breed-remove"
                      onClick={() => onRemove(breed)}
                    >
                      <Icon name="close" size={13} />
                      <span className="u-visually-hidden">Remove {breed.name}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr className="compare__group-row">
                <th scope="colgroup" colSpan={breeds.length + 1}>
                  Measurements
                </th>
              </tr>
              {measurementRows.filter(visibleRow).map((row) => (
                <tr key={row.label} data-uniform={row.uniform || undefined}>
                  <th scope="row" className="compare__row-label">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={index} className="compare__value">
                      {value ?? em}
                    </td>
                  ))}
                </tr>
              ))}

              {traitGroups.map((group) => {
                const rows = group.rows.filter(visibleRow);
                if (!rows.length) return null;

                return (
                  <Fragment key={group.id}>
                    <tr className="compare__group-row">
                      <th scope="colgroup" colSpan={breeds.length + 1}>
                        {group.label}
                      </th>
                    </tr>
                    {rows.map(({ trait, values, uniform }) => (
                      <tr key={trait.key} data-uniform={uniform || undefined}>
                        <th scope="row" className="compare__row-label" title={trait.help}>
                          {trait.label}
                        </th>
                        {values.map((value, index) => (
                          <td key={index} className="compare__value">
                            <div
                              className="compare__meter"
                              role="meter"
                              aria-valuemin={0}
                              aria-valuemax={TRAIT_MAX}
                              aria-valuenow={value ?? undefined}
                              aria-valuetext={traitDescription(trait.key, value)}
                              aria-label={`${trait.label}, ${breeds[index].name}`}
                            >
                              {Array.from({ length: TRAIT_MAX }).map((_, segment) => (
                                <span
                                  key={segment}
                                  className="compare__segment"
                                  data-filled={
                                    value !== null && segment < value ? "" : undefined
                                  }
                                />
                              ))}
                            </div>
                            <span className="compare__meter-text">
                              {traitDescription(trait.key, value)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="compare__footnote">
          Measurements follow United States standards (inches, pounds). Traits are scored on a
          0–5 scale.
        </p>
      </div>
    </div>
  );
}
