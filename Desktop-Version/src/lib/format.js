/* Presentation helpers for the imperial measurements the API returns. */

const isNum = (n) => Number.isFinite(n);

/** "22–24" or "22" when both ends match, or null when data is missing. */
export const range = (min, max, { unit = "" } = {}) => {
  const suffix = unit ? `${unit}` : "";
  if (isNum(min) && isNum(max)) {
    return min === max ? `${min}${suffix}` : `${min}–${max}${suffix}`;
  }
  if (isNum(min)) return `${min}${suffix}`;
  if (isNum(max)) return `${max}${suffix}`;
  return null;
};

export const lifeSpan = (breed) => range(breed.min_life_expectancy, breed.max_life_expectancy);

export const heightRange = (breed, sex) =>
  sex === "female"
    ? range(breed.min_height_female, breed.max_height_female)
    : range(breed.min_height_male, breed.max_height_male);

export const weightRange = (breed, sex) =>
  sex === "female"
    ? range(breed.min_weight_female, breed.max_weight_female)
    : range(breed.min_weight_male, breed.max_weight_male);

/** Midpoint of a min/max pair, used for sorting. Infinity sinks missing data. */
export const midpoint = (min, max) => {
  if (isNum(min) && isNum(max)) return (min + max) / 2;
  if (isNum(min)) return min;
  if (isNum(max)) return max;
  return null;
};

/** Rough size band from average male weight - a fast scanning cue on cards. */
export const sizeBand = (breed) => {
  const avg = midpoint(breed.min_weight_male, breed.max_weight_male);
  if (avg === null) return null;
  if (avg < 15) return "Toy";
  if (avg < 30) return "Small";
  if (avg < 60) return "Medium";
  if (avg < 90) return "Large";
  return "Giant";
};

export const em = "—";
