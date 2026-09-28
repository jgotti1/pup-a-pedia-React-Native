/* ---------------------------------------------------------------------------
   Trait vocabulary. The API returns bare 0-5 integers; everything a human
   reads about those numbers lives here so the UI layer stays presentational.
   --------------------------------------------------------------------------- */

const scale = (labels) => labels;

export const TRAIT_GROUPS = [
  {
    id: "temperament",
    label: "Temperament",
    traits: [
      {
        key: "energy",
        label: "Energy",
        help: "How much daily activity the breed needs.",
        levels: scale([
          "Calm and relaxed",
          "Low energy level",
          "Moderate energy level",
          "Energetic",
          "Very energetic",
          "Extremely energetic",
        ]),
      },
      {
        key: "playfulness",
        label: "Playfulness",
        help: "Appetite for games and play sessions.",
        levels: scale([
          "Very low playfulness",
          "Low playfulness",
          "Moderate playfulness",
          "Playful",
          "Very playful",
          "Extremely playful",
        ]),
      },
      {
        key: "trainability",
        label: "Trainability",
        help: "How readily the breed takes to training.",
        levels: scale([
          "Not a trainable breed",
          "Not very trainable",
          "Somewhat trainable",
          "Moderately trainable",
          "Highly trainable",
          "Extremely trainable",
        ]),
      },
      {
        key: "protectiveness",
        label: "Protectiveness",
        help: "Tendency to guard people and territory.",
        levels: scale([
          "Not a protective breed",
          "Not very protective",
          "Somewhat protective",
          "Moderately protective",
          "Very protective",
          "Extremely protective",
        ]),
      },
      {
        key: "barking",
        label: "Barking",
        help: "How vocal the breed tends to be.",
        levels: scale([
          "Silent breed",
          "Rarely barks",
          "Somewhat barky",
          "Moderately barky",
          "Frequently barky",
          "Extremely barky",
        ]),
      },
    ],
  },
  {
    id: "household",
    label: "Household fit",
    traits: [
      {
        key: "good_with_children",
        label: "Good with kids",
        help: "Suitability for homes with children.",
        levels: scale([
          "Not recommended with children",
          "Poor fit for homes with children",
          "Needs supervision around kids",
          "Generally good with children",
          "Very patient with kids",
          "Excellent with children",
        ]),
      },
      {
        key: "good_with_other_dogs",
        label: "Good with dogs",
        help: "Suitability for multi-dog homes.",
        levels: scale([
          "Not for homes with other dogs",
          "Poor fit with other dogs",
          "May clash with certain dogs",
          "Generally good with other dogs",
          "Very sociable with other dogs",
          "Excellent with other dogs",
        ]),
      },
      {
        key: "good_with_strangers",
        label: "Good with strangers",
        help: "Reaction to unfamiliar people.",
        levels: scale([
          "Very guarded around strangers",
          "Anxious around strangers",
          "Reserved with strangers",
          "Cautious but approachable",
          "Generally welcoming",
          "Very friendly with strangers",
        ]),
      },
    ],
  },
  {
    id: "care",
    label: "Care and upkeep",
    traits: [
      {
        key: "coat_length",
        label: "Coat length",
        help: "How long the breed's coat grows.",
        levels: scale([
          "Hairless or near-hairless",
          "Very short coat",
          "Short coat",
          "Medium-length coat",
          "Long coat",
          "Very long coat",
        ]),
      },
      {
        key: "grooming",
        label: "Grooming",
        help: "Brushing and coat maintenance required.",
        levels: scale([
          "Very low grooming needs",
          "Minimal grooming",
          "Low grooming needs",
          "Moderate grooming",
          "Frequent grooming",
          "High grooming demands",
        ]),
      },
      {
        key: "shedding",
        label: "Shedding",
        help: "How much hair the breed leaves behind.",
        levels: scale([
          "No shedding",
          "Minimal shedding",
          "Light shedding",
          "Moderate shedding",
          "Significant shedding",
          "Maximum shedding",
        ]),
      },
      {
        key: "drooling",
        label: "Drooling",
        help: "How much the breed drools.",
        levels: scale([
          "Very low drooling",
          "Minimal drooling",
          "Occasional drooling",
          "Moderate drooling",
          "Frequent drooling",
          "Excessive drooling",
        ]),
      },
    ],
  },
];

export const ALL_TRAITS = TRAIT_GROUPS.flatMap((group) => group.traits);

const TRAIT_BY_KEY = new Map(ALL_TRAITS.map((trait) => [trait.key, trait]));

export const getTrait = (key) => TRAIT_BY_KEY.get(key);

export const TRAIT_MAX = 5;

/** Clamped integer value for a trait, or null when the API omitted it. */
export const traitValue = (breed, key) => {
  const raw = breed?.[key];
  if (!Number.isFinite(raw)) return null;
  return Math.max(0, Math.min(TRAIT_MAX, Math.round(raw)));
};

/** Human sentence for a trait value, e.g. "Moderate shedding". */
export const traitDescription = (key, value) => {
  const trait = getTrait(key);
  if (!trait || value === null) return "Not rated";
  return trait.levels[value] ?? "Not rated";
};

/* Filters shown in the rail. Each one is a "at least this much" threshold,
   which is how people actually shop for a dog ("must be good with kids"). */
export const QUICK_FILTERS = [
  { id: "kids", label: "Great with kids", key: "good_with_children", min: 4 },
  { id: "dogs", label: "Great with other dogs", key: "good_with_other_dogs", min: 4 },
  { id: "trainable", label: "Highly trainable", key: "trainability", min: 4 },
  { id: "lowShed", label: "Low shedding", key: "shedding", max: 2 },
  { id: "lowGroom", label: "Low grooming", key: "grooming", max: 2 },
  { id: "quiet", label: "Quiet", key: "barking", max: 2 },
  { id: "calm", label: "Calm at home", key: "energy", max: 2 },
];

export const matchesFilter = (breed, filter) => {
  const value = traitValue(breed, filter.key);
  if (value === null) return false;
  if (filter.min !== undefined && value < filter.min) return false;
  if (filter.max !== undefined && value > filter.max) return false;
  return true;
};
