import Icon from "./Icon";
import "./ResultsToolbar.css";

export const SORT_OPTIONS = [
  { value: "relevance", label: "Best match" },
  { value: "name", label: "Name A–Z" },
  { value: "lifespan", label: "Longest lifespan" },
  { value: "weight-asc", label: "Smallest first" },
  { value: "weight-desc", label: "Largest first" },
  { value: "energy", label: "Most energetic" },
  { value: "trainability", label: "Most trainable" },
];

export default function ResultsToolbar({
  term,
  shownCount,
  totalCount,
  sort,
  onSortChange,
  hasResults,
  canRefine,
  activeFilterCount,
  onToggleFilters,
  filtersOpen,
  onNewSearch,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar__headings">
        <p className="toolbar__eyebrow">Search results</p>
        <h1 className="toolbar__title">
          <span className="toolbar__term">“{term}”</span>
          <span className="toolbar__count">
            {shownCount === totalCount
              ? `${totalCount} ${totalCount === 1 ? "breed" : "breeds"}`
              : `${shownCount} of ${totalCount} breeds`}
          </span>
        </h1>
      </div>

      <div className="toolbar__controls">
        {canRefine && (
          <button
            type="button"
            className="toolbar__filter-toggle"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
          >
            <Icon name="sliders" size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && <span className="toolbar__badge">{activeFilterCount}</span>}
          </button>
        )}

        {/* Sorting an empty or errored result set is a control with nothing to act on. */}
        {hasResults && (
          <div className="toolbar__select">
            <label className="u-visually-hidden" htmlFor="sort-results">
              Sort results
            </label>
            <select
              id="sort-results"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={15} className="toolbar__select-icon" />
          </div>
        )}

        <button type="button" className="toolbar__new-search" onClick={onNewSearch}>
          New search
        </button>
      </div>
    </div>
  );
}
