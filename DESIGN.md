# SentinelPulse design tokens

SentinelPulse reads as a threat bulletin: a printed intelligence brief or a wire-service front page, not a SaaS dashboard. Structure comes from type, rules and space. Nothing on the main view sits in a bordered box; sections are separated by ink rules and column rules, the way a newspaper page is.

Every token below lives in `src/index.css`. Components use the token names, never raw values. Chart code reads the same values from `src/lib/palette.js`, which mirrors the CSS.

## Colour

Light is the default. Dark follows `prefers-color-scheme` until the reader picks one with the masthead toggle; the choice is stored under `sp:theme` in localStorage. Neutrals are tinted warm in both modes.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `paper` | `#F4F2ED` | `#16150F` | Page |
| `paper-2` | `#ECE9E2` | `#201F19` | Row hover, input fill |
| `paper-3` | `#DFDBD1` | `#2B2A23` | Skeleton blocks, pressed state |
| `sheet` | `#FBFAF7` | `#211F1A` | Floating layers only: modal, menus, toasts, chart tooltip |
| `rule` | `#D3CEC3` | `#35332B` | Hairlines between rows and column rules |
| `rule-strong` | `#8F8A7E` | `#77736A` | Input underlines, unfilled level bars, Low severity bars |
| `ink` | `#16150F` | `#EEEBE3` | Text, heavy rules, primary button fill |
| `ink-2` | `#45423A` | `#C4BFB3` | Secondary text |
| `ink-3` | `#68645A` | `#9E998D` | Metadata, times, labels |
| `on-ink` | `#F4F2ED` | `#16150F` | Text on the primary button and selected toggles |
| `signal` | `#B93D0C` | `#F08A4B` | Critical severity and the lead story kicker. Nothing else. |

The signal colour appears in exactly two roles: the word Critical (and its bars) and the lead story's kicker. A Severe posture also sets the threat level word in signal. Every other distinction is made with weight, size and the four level bars.

### Contrast (WCAG 2.1 ratios, computed from the hex values)

| Pair | Light | Dark |
| --- | --- | --- |
| ink on paper | 16.35 | 15.35 |
| ink-2 on paper | 8.97 | 9.97 |
| ink-3 on paper | 5.27 | 6.44 |
| ink-3 on paper-2 (hovered row) | 4.87 | 5.82 |
| signal on paper | 5.02 | 7.35 |
| signal on paper-2 | 4.64 | 6.64 |
| on-ink on ink (primary button) | 16.35 | 15.35 |
| rule-strong on paper (input edge, Low bars) | 3.07 | 3.87 |

## Severity

| Severity | Text | Bars and chart fill |
| --- | --- | --- |
| Critical | `signal`, semibold | `signal` |
| High | `ink`, semibold | `ink` |
| Medium | `ink-2`, medium | `ink-3` |
| Low | `ink-3`, regular | `rule-strong` |

Each level also carries a word and a four-bar mark (4, 3, 2, 1 bars filled), so severity never depends on colour.

## Type

Three faces with fixed jobs, loaded from Google Fonts:

- **Archivo**, width axis at 78 (`font-stretch: 78%`), weight 800: headlines, section heads, the masthead name, large figures.
- **IBM Plex Sans** 400, 500, 600: body and UI text.
- **IBM Plex Mono** 400, 500: IDs, indicators, ATT&CK IDs, times, the dateline.

All numbers use tabular figures. Large sizes get tight tracking, small sizes none.

| Step | Size / line height | Tracking | Use |
| --- | --- | --- | --- |
| `xs` | 12 / 16 | 0.02em (mono) | Time gutter, IDs, dateline, labels |
| `sm` | 13 / 20 | 0 | Row metadata, toolbar, rail rows |
| `base` | 14 / 20 | 0 | Wire titles, controls, modal body |
| `md` | 16 / 24 | 0 | Lead summary, modal summary |
| `lg` | 20 / 24 | -0.005em | Rail section heads, clipping titles |
| `xl` | 26 / 28 | -0.01em | Wire section head, masthead name, modal title |
| `2xl` | 34 / 36 | -0.015em | Lead headline on phones, threat level on phones |
| `3xl` | 46 / 44 | -0.02em | Threat level (H1) |
| `4xl` | 60 / 56 | -0.025em | Lead headline |

## Spacing

4 px scale only: 4, 8, 12, 16, 24, 32, 48, 64 (Tailwind 1, 2, 3, 4, 6, 8, 12, 16). Page gutter 16 on phones, 32 from `lg`. Column gutter 32 with a hairline column rule in the middle. Space between bands 48; space inside a group 8 or 12.

## Rules

- Masthead: 4 px `ink` rule, 2 px gap, 1 px `ink` rule (the nameplate double rule).
- Section heads: 2 px `ink` rule above the head.
- Rows and rail entries: 1 px `rule` hairline.
- Column rule between the wire and the rail, and between the threat level and the lead: 1 px `rule`.

No other borders on the main view.

## Radius

`sm` 2 px for every control, kbd and bar. `md` 4 px for floating layers (modal, menus, toasts). Nothing nests, so no inner radius is needed.

## Elevation

The page is flat paper. Shadows appear only on floating layers, light from above, two parts:

- `shadow-pop` (menus, toasts, tooltip): light `0 1px 2px rgb(22 21 15 / 0.10), 0 6px 16px rgb(22 21 15 / 0.10)`; dark `0 1px 2px rgb(0 0 0 / 0.5), 0 8px 16px rgb(0 0 0 / 0.4)`
- `shadow-modal`: light `0 2px 4px rgb(22 21 15 / 0.10), 0 16px 32px rgb(22 21 15 / 0.16)`; dark `0 2px 4px rgb(0 0 0 / 0.5), 0 16px 32px rgb(0 0 0 / 0.5)`

No glows, gradients, blur, grain or translucent surfaces.

## Controls

- Height 40 px for every button, input and select; 32 px for the compact severity toggles inside the toolbar line on desktop. Icon buttons 40 x 40.
- Primary button: `ink` fill, `on-ink` text. Secondary: `paper-2` fill, `ink` text. Hover goes one step darker in light and lighter in dark; press moves 1 px down. No outline-only buttons.
- Inputs and selects: `paper-2` fill with a 1 px `rule-strong` underline, like a form line on paper.
- Selected toggle: `ink` fill, `on-ink` text.
- Focus: 2 px `ink` outline, 2 px offset.
- Status is a word (Active, Investigating, Monitoring, Mitigated, Remediated, Patched). Open work in `ink` semibold, closed work in `ink-3`.

## Motion

Only state changes animate: menus, modal and toasts (150 ms opacity and 4 px travel) and a single 1.8 s `paper-3` tint on a newly arrived wire row. Nothing loops, nothing fades in on load or scroll, and `prefers-reduced-motion` turns all of it off.

## Icons

Feather (`react-icons/fi`), 16 px, stroke inherits `currentColor`. Used only on controls (search, sound, alerts, theme, close, copy, download, share). Never as decoration next to headings.
