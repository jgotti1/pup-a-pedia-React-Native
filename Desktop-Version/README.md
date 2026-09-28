# Pup-A-Pedia — Web

Look up a dog breed and get its temperament, care needs, household fit, size and
lifespan laid out side by side, so you can compare breeds like for like instead
of reading ten articles that all say something different.

This is the desktop/web build. The repo root holds the separate React Native
app.

## What you can do

**Search any breed.** Type a name and get every match — searching a specific
breed like *Golden Retriever* returns one card, while a broader term like
*retriever* or *poodle* returns the whole family. The search box suggests
popular breeds as you type, and works entirely from the keyboard.

**Read 14 rated traits.** Every breed is scored 0–5 on energy, playfulness,
trainability, protectiveness, barking, grooming, shedding, drooling, coat
length, and how it does with children, other dogs and strangers. Each rating
shows as a bar you can scan down a column, with the plain-English meaning
("Moderately barky") alongside it in the full profile.

**See the numbers that matter.** Height, weight and life expectancy, broken out
by sex, plus a size class from Toy through Giant.

**Narrow a long result list.** When a search returns enough breeds to be worth
filtering, a refine panel appears with requirements like *great with kids*,
*low shedding* or *quiet*. Each option shows how many breeds it would leave you
with, so you never click into an empty list. You can also sort by name,
lifespan, size, energy or trainability.

**Compare breeds side by side.** Add breeds to a compare tray as you find them —
up to four — then open a full comparison with breeds as columns and every
attribute as a row. The tray carries across searches and survives a reload, so
you can weigh a Labrador against a Poodle even though they take two separate
searches to find. Rows where every breed scores the same are dimmed, and an
**Only show differences** toggle hides them entirely so the things that actually
separate your candidates stand out.

**Light and dark.** Follows your system preference and remembers your choice.

**Works on a phone.** Built for the desktop canvas first, then stepped down —
the filter panel folds into a toggle, and the comparison scrolls sideways with
the attribute names pinned in place.

## Accessibility

Search suggestions are fully keyboard-navigable, dialogs trap focus and return
it where you left off, ratings are exposed to screen readers with their meaning
rather than a bare number, the comparison is a real table with proper headers,
there is a skip link, and focus outlines are never removed. Animation respects
`prefers-reduced-motion`.

## Running it

```bash
cd Desktop-Version
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve that build
```

## Configuration

Breed data comes from a hosted API. Copy `.env.example` to `.env` and fill in:

```
VITE_API_URL=...
VITE_API_KEY=...
```

If either is missing the app tells you so on screen instead of silently
returning nothing.

> The key is bundled into the client, which is unavoidable for a static site
> calling the API directly. Put a small proxy in front of it before deploying
> this somewhere public.

## Contributing

Architecture, conventions, and the pitfalls worth knowing before you change
anything are in [CLAUDE.md](CLAUDE.md).
