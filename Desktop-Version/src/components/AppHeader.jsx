import Icon from "./Icon";
import SearchField from "./SearchField";
import "./AppHeader.css";

/**
 * Persistent app bar. The search control only appears here once the visitor
 * has left the landing view, so the hero stays the single point of entry.
 */
export default function AppHeader({
  showSearch,
  query,
  onQueryChange,
  onSearch,
  isLoading,
  onHome,
  theme,
  onToggleTheme,
  version,
  overHero = false,
}) {
  return (
    <header className="appbar" data-over-hero={overHero || undefined}>
      <div className="appbar__inner">
        <button type="button" className="appbar__brand" onClick={onHome}>
          <span className="appbar__brand-mark" aria-hidden="true">
            <Icon name="paw" size={20} />
          </span>
          <span className="appbar__brand-text">
            Pup <span className="appbar__brand-paw">A</span> Pedia
          </span>
          <span className="u-visually-hidden">— back to search</span>
        </button>

        <div className="appbar__search" data-visible={showSearch || undefined}>
          {showSearch && (
            <SearchField
              id="header-breed-search"
              variant="compact"
              value={query}
              onChange={onQueryChange}
              onSubmit={onSearch}
              isLoading={isLoading}
            />
          )}
        </div>

        <div className="appbar__actions">
          <span className="appbar__version">v{version}</span>

          <button
            type="button"
            className="appbar__icon-button"
            onClick={onToggleTheme}
            aria-pressed={theme === "light"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
            <span className="u-visually-hidden">
              {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            </span>
          </button>

          <a
            className="appbar__credit"
            href="https://johnmargotti.com/"
            target="_blank"
            rel="noreferrer"
          >
            margotticode
            <Icon name="external" size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
