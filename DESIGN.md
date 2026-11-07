# SentinelPulse design tokens

Dark, monochrome SOC console. Neutrals are tinted cool (a few percent blue) and never pure black or white. One muted red is the only hue, and it is reserved for Critical severity and the Severe posture. Every token below lives in `src/index.css` under `@theme`; components use the token names, never raw values.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#0C0D0F` | Page |
| `panel` | `#131518` | Panels, cards, table |
| `raised` | `#1B1E22` | Inputs, buttons, popovers, modal, toasts |
| `hover` | `#23272C` | Hover state of raised and panel items |
| `line` | `#262A30` | Hairline borders and row dividers |
| `line-strong` | `#363B43` | Focus-adjacent borders, empty glyph bars, new-item border |
| `ink` | `#ECEEF0` | Primary text, primary button fill |
| `ink-2` | `#A9AEB6` | Secondary text |
| `ink-3` | `#80868F` | Labels, metadata (4.99:1 on panel) |
| `on-ink` | `#0C0D0F` | Text on the primary button |
| `crit` | `#E0625C` | Critical severity, Severe posture (5.29:1 on panel) |

Severity encoding never relies on colour alone: each level has a word and a four-bar mark (4, 3, 2, 1 bars filled).

| Severity | Text | Chart fill |
| --- | --- | --- |
| Critical | `crit`, semibold | `#E0625C` |
| High | `ink`, semibold | `#C9CDD2` |
| Medium | `ink-2`, medium | `#80868F` |
| Low | `ink-3`, regular | `#646B74` (3.39:1 on panel) |

## Type

IBM Plex Sans for all UI text, IBM Plex Mono for IDs, indicators and keyboard hints. Numbers use tabular figures.

| Step | Size / line height | Use |
| --- | --- | --- |
| `xs` | 12 / 16 | Labels (uppercase, semibold, 0.04em tracking), metadata |
| `sm` | 13 / 20 | Table cells, card body, controls |
| `base` | 14 / 20 | Body, card titles |
| `lg` | 16 / 24 | Panel titles, modal title on phones |
| `xl` | 20 / 28 | Page title on phones, modal title |
| `2xl` | 24 / 32 | Page title |
| `stat` | 28 / 32 | Metric values (-0.01em tracking) |

## Spacing

4 px scale only: 4, 8, 12, 16, 24, 32, 48, 64 (Tailwind 1, 2, 3, 4, 6, 8, 12, 16). Panel padding 16 on phones, 24 from `sm`. Gap between sections 16 on phones, 24 from `sm`; gap inside a group 8 or 12.

## Radius

`sm` 4 (swatches, kbd), `md` 6 (buttons, inputs, selects), `lg` 8 (panels, cards, popovers, modal, toasts). Nothing inside a panel is boxed, so no inner radius is needed.

## Elevation

Dark mode depth is tonal: `bg`, then `panel`, then `raised`. Shadows only on floating layers, light from above:

- `shadow-pop` (menus, toasts, chart tooltips): `0 1px 2px rgb(0 0 0 / 0.5), 0 8px 16px rgb(0 0 0 / 0.35)`
- `shadow-modal`: `0 2px 4px rgb(0 0 0 / 0.5), 0 16px 32px rgb(0 0 0 / 0.45)`

No glows, gradients, blur or translucent surfaces.

## Controls

- Height 40 px for every button, input, select and toggle. Icon buttons 40 x 40.
- Primary button: `ink` fill, `on-ink` text. Secondary: `raised` fill, `ink` text. Hover goes one step lighter, press moves 1 px down. No outline-only buttons.
- Selected toggle: `ink` fill, `on-ink` text. Unselected: `raised` fill.
- Focus: 2 px `ink-2` outline, 2 px offset.

## Motion

Only state changes animate: popovers, modal and toasts (150 ms opacity and 4 px travel), a single 1.8 s tint on newly arrived rows, the metric count-up. Nothing loops, nothing fades in on load or scroll, and `prefers-reduced-motion` turns all of it off.
