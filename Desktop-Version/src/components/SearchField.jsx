import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { POPULAR_BREEDS } from "../lib/popularBreeds";
import "./SearchField.css";

/**
 * The single search control, used at hero scale on the landing view and at
 * compact scale in the header once results exist.
 * Suggestions are a filtered, keyboard-navigable listbox (combobox pattern).
 */
export default function SearchField({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  variant = "hero",
  autoFocus = false,
  id,
}) {
  const generatedId = useId();
  const inputId = id ?? `breed-search-${generatedId}`;
  const listId = `${inputId}-suggestions`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [validationMessage, setValidationMessage] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const term = value.trim().toLowerCase();
  const suggestions = POPULAR_BREEDS.filter(
    (breed) => !term || (breed.toLowerCase().includes(term) && breed.toLowerCase() !== term)
  ).slice(0, 6);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const commit = (nextValue) => {
    const query = (nextValue ?? value).trim();
    setIsOpen(false);
    setActiveIndex(-1);

    if (!query) {
      setValidationMessage("Enter a breed name to search.");
      inputRef.current?.focus();
      return;
    }

    setValidationMessage("");
    if (nextValue !== undefined) onChange(nextValue);
    onSubmit(query);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      // Chrome clears an <input type="search"> on Escape. When the suggestion
      // list is open, Escape should dismiss it and leave the query intact.
      if (isOpen) event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!suggestions.length) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => {
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = current + delta;
        if (next < 0) return suggestions.length - 1;
        if (next >= suggestions.length) return 0;
        return next;
      });
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      commit(suggestions[activeIndex]);
    }
  };

  const showSuggestions = isOpen && suggestions.length > 0;

  return (
    <div
      className={`search search--${variant}`}
      ref={wrapperRef}
      data-loading={isLoading || undefined}
    >
      <form
        className="search__form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          commit();
        }}
      >
        <label className="u-visually-hidden" htmlFor={inputId}>
          Search dog breeds
        </label>

        <span className="search__icon" aria-hidden="true">
          <Icon name="search" size={variant === "hero" ? 20 : 17} />
        </span>

        <input
          id={inputId}
          ref={inputRef}
          className="search__input"
          type="search"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showSuggestions && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          aria-describedby={validationMessage ? `${inputId}-error` : undefined}
          placeholder={
            variant === "hero" ? "Search a breed — try “Golden Retriever”" : "Search a breed"
          }
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={(event) => {
            onChange(event.target.value);
            setValidationMessage("");
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => {
            // Only re-open for a field the visitor has already typed into.
            // Opening on autofocus buried the hero behind the listbox.
            if (value) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />

        {value && (
          <button
            type="button"
            className="search__clear"
            onClick={() => {
              onChange("");
              setValidationMessage("");
              inputRef.current?.focus();
            }}
          >
            <Icon name="close" size={15} />
            <span className="u-visually-hidden">Clear search</span>
          </button>
        )}

        <button type="submit" className="search__submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="search__spinner" aria-hidden="true" />
              <span>Searching</span>
            </>
          ) : (
            <>
              <Icon name="search" size={16} className="search__submit-icon" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {showSuggestions && (
        <ul className="search__suggestions" id={listId} role="listbox" aria-label="Breed suggestions">
          {suggestions.map((breed, index) => (
            <li key={breed} role="presentation">
              <button
                type="button"
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className="search__suggestion"
                data-active={index === activeIndex || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(breed)}
              >
                <Icon name="search" size={14} />
                <span>{breed}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="search__error" id={`${inputId}-error`} role="alert">
        {validationMessage}
      </p>
    </div>
  );
}
