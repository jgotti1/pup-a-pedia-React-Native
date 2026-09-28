import Icon from "./Icon";
import "./FilterRail.css";

/**
 * Desktop-first filter rail. Every filter shows how many of the current
 * results it would keep, so nobody has to click into a dead end.
 */
export default function FilterRail({
  filters,
  counts,
  active,
  onToggle,
  onClear,
  totalCount,
  shownCount,
}) {
  const activeCount = active.length;

  return (
    <aside className="rail" aria-label="Refine results">
      <div className="rail__head">
        <h2 className="rail__title">
          <Icon name="sliders" size={16} />
          Refine
        </h2>
        {activeCount > 0 && (
          <button type="button" className="rail__clear" onClick={onClear}>
            Clear ({activeCount})
          </button>
        )}
      </div>

      <p className="rail__summary" aria-live="polite">
        Showing <strong>{shownCount}</strong> of {totalCount}
      </p>

      <fieldset className="rail__group">
        <legend className="rail__legend">Must have</legend>
        <ul className="rail__list">
          {filters.map((filter) => {
            const count = counts[filter.id] ?? 0;
            const isActive = active.includes(filter.id);
            const isDisabled = count === 0 && !isActive;

            return (
              <li key={filter.id}>
                <label className="rail__option" data-disabled={isDisabled || undefined}>
                  <input
                    type="checkbox"
                    className="rail__checkbox"
                    checked={isActive}
                    disabled={isDisabled}
                    onChange={() => onToggle(filter.id)}
                  />
                  <span className="rail__option-label">{filter.label}</span>
                  <span className="rail__option-count">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <p className="rail__note">
        <Icon name="info" size={14} />
        Traits are scored on a 0–5 scale. Unrated traits never match a filter.
      </p>
    </aside>
  );
}
