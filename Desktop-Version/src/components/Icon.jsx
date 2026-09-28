/* Inline icon set. Kept local so the app ships no icon dependency and every
   glyph inherits currentColor and the surrounding font size. */

const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </>
  ),
  close: <path d="m5 5 14 14M19 5 5 19" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  columns: (
    <>
      <rect x="3.5" y="4.5" width="7" height="15" rx="1.5" />
      <rect x="13.5" y="4.5" width="7" height="15" rx="1.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  moon: <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />,
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  arrowRight: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  alert: (
    <>
      <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
      <path d="M12 10v4.2M12 17.2v.2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="7" cy="9" rx="2.1" ry="2.6" />
      <ellipse cx="12" cy="7" rx="2.1" ry="2.7" />
      <ellipse cx="17" cy="9" rx="2.1" ry="2.6" />
      <path d="M12 12c3.4 0 5.6 2.2 5.6 4.5 0 2-1.8 3-3.6 2.6-1.3-.3-2.7-.3-4 0-1.8.4-3.6-.6-3.6-2.6C6.4 14.2 8.6 12 12 12Z" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 5h5.5v5.5" />
      <path d="M19 5l-7.5 7.5" />
      <path d="M17 14.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8.5A1.5 1.5 0 0 1 6 7h3.5" />
    </>
  ),
  photoOff: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.8 16l4.4-4a2 2 0 0 1 2.7 0l2.3 2.1" />
      <circle cx="15.5" cy="9.8" r="1.4" />
    </>
  ),
};

export default function Icon({ name, size = 18, strokeWidth = 1.7, className, ...rest }) {
  const glyph = paths[name];
  if (!glyph) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  );
}
