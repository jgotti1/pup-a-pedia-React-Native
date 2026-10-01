import Icon from "./Icon";
import { COMPARE_LIMIT, breedId } from "../hooks/useCompare";
import "./CompareTray.css";

/**
 * Docked tray showing what is queued for comparison. Stays put across searches
 * and across the landing view, because building a comparison usually takes more
 * than one search.
 */
export default function CompareTray({ items, onRemove, onClear, onCompare, canCompare }) {
  if (!items.length) return null;

  const slots = Array.from({ length: COMPARE_LIMIT }, (_, index) => items[index] ?? null);

  return (
    <div className="tray" role="region" aria-label="Breeds queued for comparison">
      <div className="tray__inner">
        <div className="tray__lead">
          <span className="tray__count">
            {items.length}/{COMPARE_LIMIT}
          </span>
          <span className="tray__label">Compare list</span>
        </div>

        <ul className="tray__slots">
          {slots.map((breed, index) =>
            breed ? (
              <li className="tray__slot" key={breedId(breed)}>
                <span className="tray__thumb" aria-hidden="true">
                  {breed.image_link ? (
                    <img src={breed.image_link} alt="" decoding="async" />
                  ) : (
                    <Icon name="paw" size={14} />
                  )}
                </span>
                <span className="tray__name">{breed.name}</span>
                <button
                  type="button"
                  className="tray__remove"
                  onClick={() => onRemove(breed)}
                  title={`Remove ${breed.name}`}
                >
                  <Icon name="close" size={13} />
                  <span className="u-visually-hidden">Remove {breed.name} from compare</span>
                </button>
              </li>
            ) : (
              // Empty slots make the remaining capacity obvious at a glance.
              <li className="tray__slot tray__slot--empty" key={`empty-${index}`} aria-hidden="true">
                <Icon name="paw" size={14} />
              </li>
            )
          )}
        </ul>

        <div className="tray__actions">
          <button type="button" className="tray__clear" onClick={onClear}>
            Clear
          </button>
          <button
            type="button"
            className="tray__compare"
            onClick={onCompare}
            disabled={!canCompare}
            title={canCompare ? undefined : "Add at least two breeds to compare"}
          >
            <span>Compare {items.length}</span>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
