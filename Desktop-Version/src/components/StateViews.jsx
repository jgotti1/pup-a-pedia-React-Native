import Icon from "./Icon";
import { POPULAR_BREEDS } from "../lib/popularBreeds";
import "./StateViews.css";

/** Skeleton grid that mirrors the real card geometry, so nothing jumps. */
export function ResultsSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-card__media shimmer" />
          <div className="skeleton-card__body">
            <div className="shimmer skeleton-line skeleton-line--title" />
            <div className="shimmer skeleton-line skeleton-line--stats" />
            <div className="skeleton-card__traits">
              <div className="shimmer skeleton-line" />
              <div className="shimmer skeleton-line" />
              <div className="shimmer skeleton-line" />
            </div>
            <div className="shimmer skeleton-line skeleton-line--cta" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Nothing came back from the API for this term. */
export function NoResultsState({ term, onSuggestion }) {
  return (
    <div className="state">
      <span className="state__glyph">
        <Icon name="search" size={24} />
      </span>
      <h2 className="state__title">No breeds match “{term}”</h2>
      <p className="state__body">
        Check the spelling, or try a broader term — searching <em>retriever</em> returns every
        retriever in the dataset.
      </p>
      <ul className="state__chips">
        {POPULAR_BREEDS.slice(0, 5).map((breed) => (
          <li key={breed}>
            <button type="button" className="state__chip" onClick={() => onSuggestion(breed)}>
              {breed}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Results exist, but the active filters excluded all of them. */
export function NoMatchesState({ onClearFilters }) {
  return (
    <div className="state">
      <span className="state__glyph">
        <Icon name="sliders" size={24} />
      </span>
      <h2 className="state__title">No breeds fit those filters</h2>
      <p className="state__body">
        Your search found results, but none met every requirement. Loosen a filter to bring them
        back.
      </p>
      <button type="button" className="state__action" onClick={onClearFilters}>
        Clear all filters
      </button>
    </div>
  );
}

/** Request failed. Shows the real reason and offers a retry. */
export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__glyph state__glyph--error">
        <Icon name="alert" size={24} />
      </span>
      <h2 className="state__title">Something went wrong</h2>
      <p className="state__body">{error?.message ?? "The search could not be completed."}</p>
      {error?.kind !== "config" && (
        <button type="button" className="state__action" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
