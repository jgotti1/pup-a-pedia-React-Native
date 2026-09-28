import { useState } from "react";
import Icon from "./Icon";
import TraitMeter from "./TraitMeter";
import { traitValue } from "../lib/traits";
import { em, heightRange, lifeSpan, sizeBand, weightRange } from "../lib/format";
import "./BreedCard.css";

/* Card-level summary: the three ratings people scan for first. The rest live
   in the detail panel so the grid stays comparable row to row. */
const SUMMARY_TRAITS = [
  { key: "energy", label: "Energy" },
  { key: "trainability", label: "Trainability" },
  { key: "good_with_children", label: "Good with kids" },
];

export default function BreedCard({ breed, onOpen, onToggleCompare, isComparing, compareFull }) {
  const [imageState, setImageState] = useState("loading");

  const life = lifeSpan(breed);
  const band = sizeBand(breed);
  const height = heightRange(breed, "male");
  const weight = weightRange(breed, "male");

  return (
    <article className="breed-card">
      <div className="breed-card__media" data-state={imageState}>
        {breed.image_link && imageState !== "error" ? (
          <img
            className="breed-card__image"
            src={breed.image_link}
            alt={`${breed.name} dog`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageState("ready")}
            onError={() => setImageState("error")}
          />
        ) : (
          <div className="breed-card__image-fallback">
            <Icon name="photoOff" size={26} />
            <span>No photo available</span>
          </div>
        )}

        {band && <span className="breed-card__badge">{band}</span>}
      </div>

      <div className="breed-card__body">
        <header className="breed-card__header">
          <h3 className="breed-card__name">{breed.name}</h3>
          {life && <p className="breed-card__life">{life} year lifespan</p>}
        </header>

        <dl className="breed-card__stats">
          <div className="breed-card__stat">
            <dt>Height</dt>
            <dd>{height ? `${height}″` : em}</dd>
          </div>
          <div className="breed-card__stat">
            <dt>Weight</dt>
            <dd>{weight ? `${weight} lb` : em}</dd>
          </div>
          <div className="breed-card__stat">
            <dt>Lifespan</dt>
            <dd>{life ? `${life} yr` : em}</dd>
          </div>
        </dl>

        <div className="breed-card__traits">
          {SUMMARY_TRAITS.map((trait) => (
            <TraitMeter
              key={trait.key}
              traitKey={trait.key}
              label={trait.label}
              value={traitValue(breed, trait.key)}
              size="sm"
            />
          ))}
        </div>

        <div className="breed-card__actions">
          <button type="button" className="breed-card__cta" onClick={() => onOpen(breed)}>
            <span>Full profile</span>
            <Icon name="arrowRight" size={16} />
          </button>

          <button
            type="button"
            className="breed-card__compare"
            onClick={() => onToggleCompare(breed)}
            aria-pressed={isComparing}
            /* A full tray must still let you deselect what is already in it. */
            disabled={compareFull && !isComparing}
            title={
              compareFull && !isComparing
                ? "Compare list is full — remove one first"
                : isComparing
                  ? `Remove ${breed.name} from compare`
                  : `Add ${breed.name} to compare`
            }
          >
            <Icon name={isComparing ? "check" : "plus"} size={16} />
            <span>{isComparing ? "Added" : "Compare"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
