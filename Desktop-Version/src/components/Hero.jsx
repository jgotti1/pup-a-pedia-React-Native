import SearchField from "./SearchField";
import { useMediaQuery } from "../hooks/useMediaQuery";
import Icon from "./Icon";
import { POPULAR_BREEDS } from "../lib/popularBreeds";
import doggyCutout from "../assets/images/doggy-cutout.webp";
import "./Hero.css";

const HIGHLIGHTS = [
  { title: "14 rated traits", body: "Energy, trainability, barking and more on a 0–5 scale." },
  { title: "Household fit", body: "How a breed does with kids, other dogs and strangers." },
  { title: "Size and lifespan", body: "Height, weight and life expectancy by sex." },
];

/** Landing view: the only place the photography runs full-bleed. */
export default function Hero({ query, onQueryChange, onSearch, isLoading }) {
  // Autofocusing on a phone throws up the keyboard and hides the page.
  const canAutoFocus = useMediaQuery("(min-width: 901px) and (hover: hover)");

  return (
    <section className="hero">
      <div className="hero__content u-shell">
        <p className="hero__eyebrow">
          <Icon name="paw" size={14} />
          The dog breed reference
        </p>

        <h1 className="hero__title">
          Pup <span className="hero__title-paw">A</span> Pedia
        </h1>

        <p className="hero__lead">
          Look up any breed and get the temperament, care and household-fit ratings side by side —
          so you can compare like for like instead of reading ten articles.
        </p>

        <div className="hero__search">
          <SearchField
            id="hero-breed-search"
            variant="hero"
            value={query}
            onChange={onQueryChange}
            onSubmit={onSearch}
            isLoading={isLoading}
            autoFocus={canAutoFocus}
          />
        </div>

        <div className="hero__chips">
          <span className="hero__chips-label">Popular</span>
          <ul className="hero__chip-list">
            {POPULAR_BREEDS.slice(0, 7).map((breed) => (
              <li key={breed}>
                <button
                  type="button"
                  className="hero__chip"
                  onClick={() => {
                    onQueryChange(breed);
                    onSearch(breed);
                  }}
                >
                  {breed}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul className="hero__highlights">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title} className="hero__highlight">
              <h2 className="hero__highlight-title">{item.title}</h2>
              <p className="hero__highlight-body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <img
        className="hero__dog"
        src={doggyCutout}
        alt="A black labrador tilting its head at the camera"
        width="565"
        height="870"
        fetchpriority="high"
        decoding="async"
      />
    </section>
  );
}
