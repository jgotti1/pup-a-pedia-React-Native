import { useCallback, useEffect, useMemo, useState } from "react";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Hero from "./components/Hero";
import FilterRail from "./components/FilterRail";
import ResultsToolbar from "./components/ResultsToolbar";
import BreedCard from "./components/BreedCard";
import BreedDetail from "./components/BreedDetail";
import CompareTray from "./components/CompareTray";
import CompareView from "./components/CompareView";
import {
  ErrorState,
  NoMatchesState,
  NoResultsState,
  ResultsSkeleton,
} from "./components/StateViews";
import { useBreedSearch } from "./hooks/useBreedSearch";
import { useTheme } from "./hooks/useTheme";
import { useCompare } from "./hooks/useCompare";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { QUICK_FILTERS, matchesFilter, traitValue } from "./lib/traits";
import { midpoint } from "./lib/format";
import "./App.css";

const APP_VERSION = "2.0.0";

/** Sort comparators. Missing data always sinks to the bottom. */
const sorters = {
  relevance: null,
  name: (a, b) => a.name.localeCompare(b.name),
  lifespan: (a, b) =>
    (midpoint(b.min_life_expectancy, b.max_life_expectancy) ?? -Infinity) -
    (midpoint(a.min_life_expectancy, a.max_life_expectancy) ?? -Infinity),
  "weight-asc": (a, b) =>
    (midpoint(a.min_weight_male, a.max_weight_male) ?? Infinity) -
    (midpoint(b.min_weight_male, b.max_weight_male) ?? Infinity),
  "weight-desc": (a, b) =>
    (midpoint(b.min_weight_male, b.max_weight_male) ?? -Infinity) -
    (midpoint(a.min_weight_male, a.max_weight_male) ?? -Infinity),
  energy: (a, b) => (traitValue(b, "energy") ?? -1) - (traitValue(a, "energy") ?? -1),
  trainability: (a, b) =>
    (traitValue(b, "trainability") ?? -1) - (traitValue(a, "trainability") ?? -1),
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { status, results, activeTerm, error, search, reset } = useBreedSearch();
  const compare = useCompare();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const isWide = useMediaQuery("(min-width: 1025px)");
  const hasSearched = status !== "idle";
  const isLoading = status === "loading";

  // A fresh search invalidates any refinement from the previous one.
  useEffect(() => {
    setActiveFilters([]);
    setSort("relevance");
    setFiltersOpen(false);
  }, [activeTerm]);

  const filtered = useMemo(() => {
    if (!activeFilters.length) return results;
    const selected = QUICK_FILTERS.filter((filter) => activeFilters.includes(filter.id));
    return results.filter((breed) => selected.every((filter) => matchesFilter(breed, filter)));
  }, [results, activeFilters]);

  const sorted = useMemo(() => {
    const comparator = sorters[sort];
    return comparator ? [...filtered].sort(comparator) : filtered;
  }, [filtered, sort]);

  /* A filter only earns its place if it would split the result set. Against a
     single-breed search every filter either keeps the one result or empties
     the list, so the whole rail is chrome - drop it rather than show controls
     that cannot narrow anything. Derived from the unfiltered results so the
     list stays stable while the visitor toggles boxes. */
  const usefulFilters = useMemo(
    () =>
      QUICK_FILTERS.filter((filter) => {
        const kept = results.filter((breed) => matchesFilter(breed, filter)).length;
        return kept > 0 && kept < results.length;
      }),
    [results]
  );

  /* Facet counts are computed against the other active filters, so each number
     tells you what that checkbox would actually leave you with. */
  const filterCounts = useMemo(() => {
    const others = QUICK_FILTERS.filter((filter) => activeFilters.includes(filter.id));
    return QUICK_FILTERS.reduce((counts, filter) => {
      const rest = others.filter((other) => other.id !== filter.id);
      counts[filter.id] = results.filter(
        (breed) =>
          matchesFilter(breed, filter) && rest.every((other) => matchesFilter(breed, other))
      ).length;
      return counts;
    }, {});
  }, [results, activeFilters]);

  const runSearch = useCallback(
    (term) => {
      setSelectedBreed(null);
      search(term);
    },
    [search]
  );

  const goHome = useCallback(() => {
    reset();
    setQuery("");
    setSelectedBreed(null);
    window.scrollTo({ top: 0 });
  }, [reset]);

  const toggleFilter = useCallback((id) => {
    setActiveFilters((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const clearFilters = useCallback(() => setActiveFilters([]), []);
  const hasResults = status === "success";
  const canRefine = hasResults && usefulFilters.length > 0;
  const showRail = canRefine && (isWide || filtersOpen);

  return (
    <div className="app" data-tray={compare.items.length > 0 || undefined}>
      <a className="app__skip" href="#results">
        Skip to results
      </a>

      <AppHeader
        showSearch={hasSearched}
        query={query}
        onQueryChange={setQuery}
        onSearch={runSearch}
        isLoading={isLoading}
        onHome={goHome}
        theme={theme}
        onToggleTheme={toggleTheme}
        version={APP_VERSION}
        overHero={!hasSearched}
      />

      <main className="app__main" id="results">
        {!hasSearched && (
          <Hero
            query={query}
            onQueryChange={setQuery}
            onSearch={runSearch}
            isLoading={isLoading}
          />
        )}

        {hasSearched && (
          <div className="results u-shell">
            <ResultsToolbar
              term={activeTerm}
              shownCount={sorted.length}
              totalCount={results.length}
              sort={sort}
              onSortChange={setSort}
              hasResults={hasResults}
              canRefine={canRefine}
              activeFilterCount={activeFilters.length}
              filtersOpen={filtersOpen}
              onToggleFilters={() => setFiltersOpen((open) => !open)}
              onNewSearch={goHome}
            />

            <div className="results__layout" data-rail={showRail || undefined}>
              {showRail && (
                <FilterRail
                  filters={usefulFilters}
                  counts={filterCounts}
                  active={activeFilters}
                  onToggle={toggleFilter}
                  onClear={clearFilters}
                  totalCount={results.length}
                  shownCount={sorted.length}
                />
              )}

              <div className="results__main">
                {isLoading && <ResultsSkeleton />}

                {status === "error" && (
                  <ErrorState error={error} onRetry={() => runSearch(activeTerm)} />
                )}

                {status === "empty" && (
                  <NoResultsState
                    term={activeTerm}
                    onSuggestion={(breed) => {
                      setQuery(breed);
                      runSearch(breed);
                    }}
                  />
                )}

                {status === "success" && sorted.length === 0 && (
                  <NoMatchesState onClearFilters={clearFilters} />
                )}

                {status === "success" && sorted.length > 0 && (
                  <>
                    <p className="u-visually-hidden" aria-live="polite">
                      {sorted.length} breeds shown for {activeTerm}
                    </p>
                    <div className="results__grid">
                      {sorted.map((breed) => (
                        <BreedCard
                          key={`${breed.name}-${breed.image_link ?? ""}`}
                          breed={breed}
                          onOpen={setSelectedBreed}
                          onToggleCompare={compare.toggle}
                          isComparing={compare.isSelected(breed)}
                          compareFull={compare.isFull}
                        />
                      ))}
                    </div>
                    <p className="results__disclaimer">
                      All heights, weights and other dimensions follow United States standards.
                      Values may differ from measurements used in other regions, and conversion may
                      be required for international comparison.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <AppFooter version={APP_VERSION} />

      {selectedBreed && (
        <BreedDetail breed={selectedBreed} onClose={() => setSelectedBreed(null)} />
      )}

      <CompareTray
        items={compare.items}
        onRemove={compare.remove}
        onClear={compare.clear}
        onCompare={() => setCompareOpen(true)}
        canCompare={compare.canCompare}
      />

      {compareOpen && (
        <CompareView
          breeds={compare.items}
          onRemove={compare.remove}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
}
