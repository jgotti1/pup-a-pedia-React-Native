# CLAUDE.md — Desktop-Version

Guidance for working in `Desktop-Version/`, the React + Vite web build of
Pup-A-Pedia. The repo root is a separate Expo / React Native app; **the two do
not share code**. Changes here never affect the mobile app, and vice versa.

## Commands

Run everything from `Desktop-Version/`:

```bash
npm install
npm run dev        # vite dev server (falls back off :5173 if taken)
npm run build      # production build into dist/
npm run preview    # serve the built output
```

There is no test runner and no linter configured. Verification is done by
driving a real browser — see **Verifying changes** below.

## Architecture

```
src/
  lib/          data layer, no React imports
    api.js          fetch + BreedSearchError (kinds: config/auth/rate-limit/network/server)
    traits.js       the 0–5 trait vocabulary + quick-filter definitions
    format.js       imperial range / midpoint / size-band formatting
    popularBreeds.js
  hooks/
    useBreedSearch.js  status machine: idle|loading|success|empty|error, aborts stale requests
    useCompare.js      compare tray, localStorage-persisted, COMPARE_LIMIT = 4
    useTheme.js        light/dark, persisted, seeded from OS preference
    useMediaQuery.js   reactive breakpoints where layout drives behaviour
  styles/tokens.css    ALL color / space / type / radius / motion values
  components/          presentational; each .jsx has a sibling .css
```

Rules that keep this coherent:

- **Trait wording lives only in `traits.js`.** Adding or rewording a rating is
  one object there; it propagates to cards, the detail modal, the compare table
  and the filters. Never inline a trait sentence in JSX.
- **No hardcoded colors or spacing in component CSS.** Reference a token. This
  is what makes the light theme a second variable block rather than a second
  stylesheet. The one deliberate exception is documented inline.
- **Desktop-first.** Base CSS targets the wide canvas; `max-width` queries step
  down through 1200 / 1024 / 900 / 640 / 560. Do not add `min-width` queries.
- **`lib/` stays React-free** so data rules are testable and reusable.

## Design decisions

The reasoning behind choices that look arbitrary from the code alone. Changing
any of these is fine — knowing why they are there is the point.

**Ratings are segmented meters, not sentences.** A 0–5 bar is comparable at a
glance down a grid column, which sentences are not. The sentence still exists,
in the full profile and as `aria-valuetext`, so nothing is lost to screen
readers or to anyone wanting the detail.

**Filters render only when they can split the set.** A quick filter appears
only if it would keep some but not all of the current results, computed against
the unfiltered set so the list does not reshuffle while toggling. On a
single-breed search every filter either keeps the one result or empties the
list, so the rail and its toolbar toggle disappear entirely and the grid takes
the full width. Facet counts are computed against the *other* active filters, so
each number is what that checkbox would actually leave you with.

**Compare is a cart, not a mode.** Breeds are added from result cards to a
docked tray that persists across searches and reloads. It holds whole breed
records rather than references into the current results, because comparing a
Labrador against a Poodle takes two separate searches — a selection scoped to
one result set would be useless. Capped at four, which is what stays readable as
columns. The comparison puts breeds in columns and attributes in rows so the eye
can scan one attribute across every candidate.

On a phone the table is wider than the screen (a 124px pinned label column plus
168px per breed), so it scrolls sideways. That scroll **snaps one breed column
into full view per swipe** (`scroll-snap-type: x mandatory` on `.compare__scroll`,
`scroll-snap-align: start` + `scroll-snap-stop: always` on each `.compare__breed`)
and a constant right-edge fade hints that more columns exist. Without snap, a
casual swipe stranded you mid-column with values split at the viewport edge
("60-95" with its "lb" scrolled out of view) — reported as "not readable".
`scroll-padding-left` must equal the pinned label column's width, or a snapped
column lands underneath that sticky column; change them together.

Landscape phones get their own mode keyed on **height** (`@media (max-height:
500px)`), not width — a Pro Max turned sideways is 932px wide and would
otherwise fall into the desktop modal. At ~390px tall, the title block, a 200px
sticky photo header and the footnote consumed the entire viewport and zero data
rows were visible. That mode hides the breed photos, eyebrow and footnote and
puts the header on one line, so the sticky header is ~63px.

Compare images (`CompareView`, `CompareTray`) deliberately do **not** use
`loading="lazy"`. They sit inside a horizontally scrolling container in a fixed
modal, where iOS Safari can fail to trigger lazy loading and leave them blank.
There are at most four and they're already cached from the result cards, so
lazy loading buys nothing there. `BreedCard` keeps it — normal page scroll.

**The hero dog is a cut-out.** The original asset is a 828x1792 portrait phone
wallpaper with a grey studio backdrop and the dog in the lower third. It worked
as neither a full-bleed landscape hero (an unrecognisable smear) nor a framed
panel (fussy, and it ballooned on tall viewports). The subject is now
silhouetted straight onto the page background. Because no text sits over a
photo, the hero needs no scrim, no forced light-on-dark copy and no special
app-bar treatment — that deletion is most of why the hero CSS is simple.

**No `alert()`.** Empty input is inline validation, no matches is an empty state
offering suggestions, and a failed request is an error panel naming the real
cause (auth / rate limit / network / config) with a retry.

**No vendor naming in user-facing copy.** Provider names stay in `.env`,
`.env.example` and code comments.

## Environment

`VITE_API_URL` and `VITE_API_KEY` come from `.env` (gitignored; `.env.example`
has the shape). When either is missing, `api.js` throws a `config`-kind error
and the UI says so rather than failing silently.

The key is compiled into the client bundle — unavoidable for a static build
calling the API directly. If this is ever deployed publicly, put a small proxy
in front and drop the key from the client.

User-facing copy must not name the upstream data vendor. Keep provider names in
`.env` / `.env.example` and code comments only.

## Regenerating the hero cut-out

`src/assets/images/doggy-cutout.webp` is the silhouetted dog. It was derived
from `doggy-bkg.jpg` (kept in the repo purely as the source for this). To redo
it, use Apple's Vision framework locally — no service upload:

1. Swift program using `VNGenerateForegroundInstanceMaskRequest` +
   `generateMaskedImage(ofInstances:from:croppedToInstancesExtent:)`. Pass
   `croppedToInstancesExtent: false` so the output stays aligned to the source.
2. **Decontaminate the edges.** The raw matte leaves a rim of studio grey that
   shows as a halo on the dark theme. The backdrop is a smooth vertical
   gradient, so estimate `B(y)` from the outer ~24 columns of each row and solve
   `C = a·dog + (1−a)·B` for the dog's true color, clamping where `a` is tiny.
3. Crop to the alpha bbox, export WebP (~85 KB vs ~720 KB for PNG).
4. Check the result composited over **both** `--bg-base` values before shipping.

## Gotchas already paid for

Do not reintroduce these — each cost a real debugging cycle:

- **`ul[class]` in a reset beats component classes.** Specificity (0,1,1) vs
  (0,1,0) silently ate every list margin. The reset uses `:where(...)` to sit at
  zero specificity. Keep it that way.
- **Grid rows size to max-content.** A scrollable panel inside a grid needs an
  explicit `grid-template-rows: minmax(0, 1fr)` plus `min-height: 0` on the
  scrolling child, or `max-height` merely *clips* and no scrollbar appears. This
  made the detail modal's lower traits unreachable.
- **`flex: 1 1 320px` flips axis in a column.** Fine in the footer's row layout;
  once mobile switches to `flex-direction: column` it becomes a 320px *tall*
  basis that grows. Reset it in the mobile block.
- **Chrome clears `<input type="search">` on Escape.** The search field calls
  `preventDefault()` when its suggestion list is open so Escape dismisses the
  list without wiping the query.
- **React 18 wants lowercase `fetchpriority`.** camelCase is React 19+ and warns.
- **The filter rail is conditional.** A quick filter renders only if it would
  keep *some but not all* results, computed from the unfiltered set so the list
  stays stable while toggling. On a single-result search the whole rail and its
  toolbar toggle disappear. Don't "restore" the missing checkboxes.
- **Compare holds whole breed records**, not references into current results —
  the tray must survive a new search, which is the entire point of the feature.
- **The hero's dog size and the copy's side reservation must scale off the same
  basis.** `.hero__dog` used to be sized by `height: min(86%, 780px)` - a fixed
  pixel width once the aspect ratio resolves, independent of container width -
  while `.hero__content`'s `padding-right` was a plain percentage. Below about
  1250px container width the two disagreed and the copy ran into the
  silhouette; an iPad Pro 12.9" portrait (1024px) sat right in that zone. Fixed
  by making the dog's `width` (not height) the driving dimension, so both sides
  shrink at the same rate. If you touch hero sizing again, keep the image's
  driving dimension and the text's reservation on the same unit (both
  percentages, or both fixed), never one of each.
- **A shared property added to a base rule must be reset in every override
  block that changes how that element behaves, not just the ones you're
  focused on.** Adding `max-height` to `.hero`'s base rule (to fix the tablet
  height bug above) was never reset in the `@media (max-width: 900px)` block,
  which already resets `min-height`/`flex`/`display` for the stacked mobile
  layout. On mobile the dog flows in normal document flow *below* all the
  copy, so total content height routinely exceeds the inherited 880px/100dvh
  cap - combined with that same block's `overflow: hidden`, the dog was
  silently clipped off entirely on every phone. Shipped straight to production
  undetected because the automated checks run against a desktop/tablet-focused
  suite; only caught from an actual phone screenshot. When you add a
  constraining property (`max-height`, `overflow`, `max-width`, etc.) to an
  element's base rule, grep every `@media` block that touches that same
  selector and decide explicitly whether the new property should carry through
  or be neutralized there - don't assume "I didn't touch that block" means it
  is unaffected.
- **`min-height` is a floor, not a ceiling.** `.hero` also has `flex: 1` to fill
  the main column, which happily stretched it taller than its intended
  `min-height: min(100dvh, 880px)` cap on any viewport where the flex column
  had more than 880px of room - a tall narrow viewport (portrait tablet) being
  the common case. The visible symptom was a large dead gap above the copy,
  which then got vertically centered low enough to crowd the dog. Fixed by
  adding a matching `max-height` so the two bounds pin the actual height
  instead of one being advisory.

## Verifying changes

There is no test suite; drive Chrome with Playwright instead. Playwright's own
browsers are not downloaded here — use the system Chrome:

```js
await chromium.launch({ channel: "chrome" });
```

Before calling UI work done, check:

- Both themes (`colorScheme: "dark" | "light"` on the context).
- Several viewport **heights**, not just widths — the hero has broken twice on
  tall displays while looking fine at 950px. Use at least 1280×720, 1512×950 and
  1920×1200, plus 834 and 390 wide.
- `document.documentElement.scrollWidth - clientWidth === 0` (no h-overflow).
- Console errors and `pageerror` are empty.
- Keyboard paths still work: combobox arrows/Escape/Enter, modal focus trap and
  focus restoration on close, skip link.

Screenshot and actually look at the result. Several of the fixes above came from
seeing a render, not from reading the code.

## Portfolio card

The **root** `README.md` (not this directory's) ends with a hidden JSON block
between `portfolio-card:start` / `portfolio-card:end` markers, which a portfolio
site reads to build a project card. Keep it in sync when features, tech stack or
URLs change. It must stay valid JSON and must never contain a `--` sequence,
which would close the surrounding HTML comment early. The preview image it
points at is `docs/preview.jpg` at the repo root.
