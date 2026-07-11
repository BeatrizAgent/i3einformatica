---
name: Swiss Tech B2B
source: Stitch / I3E Modern Corporate Web Evolution
projectId: 9497721692359989053
---

# i3e Informática — Swiss Tech B2B

## Intent

Design system for a precise, trustworthy B2B technology site. The interface must feel engineered and editorial: strong hierarchy, clear actions, generous whitespace, and no decorative effect without a navigational purpose.

## Brand principles

- Technical authority without visual noise.
- Swiss editorial grid: strict alignment, visible separators, deliberate whitespace.
- Clarity before personality: short labels, direct CTAs, scannable content.
- Accessible by default: visible focus, readable contrast, semantic landmarks, keyboard-safe interactions.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `surface` | `#f9f9fb` | Page background |
| `surface-low` | `#f3f3f5` | Secondary bands and forms |
| `surface-container` | `#edeef0` | Tonal surfaces |
| `surface-lowest` | `#ffffff` | Cards, header, inputs |
| `on-surface` | `#1a1c1d` | Primary text |
| `body-charcoal` | `#333333` | Long-form body text |
| `on-surface-variant` | `#46464f` | Supporting text |
| `nav-dark` | `#0B113E` | Hero, CTA, footer, structural foundations |
| `nav-panel` | `#123663` | Service and curated content panels on dark sections |
| `action-blue` | `#21CFF1` | Primary action, active state, progress |
| `secondary` | `#00687A` | Small labels and secondary emphasis |
| `surface-separator` | `#E5E7EB` | 1px structural rules |
| `outline` | `#777680` | Secondary borders |

Do not use gradients, large decorative shadows, or pill-shaped controls for core navigation. Cyan is reserved for interaction and emphasis.

## Typography

- Headlines and labels: Geist (`--font-geist-sans`).
- Body and long-form copy: Inter (`--font-inter`).
- Display: 64px / 72px / 600 / `-0.02em`.
- Desktop headline: 48px / 56px / 600 / `-0.01em`.
- Mobile headline: 32px / 40px / 600.
- Body large: 18px / 28px.
- Body: 16px / 24px.
- Label: 14px / 20px / 600 / `0.05em`.
- Small label: 12px / 16px / 500.

Use uppercase labels sparingly with tracking. Never use all-caps for paragraphs or long navigation labels.

## Layout and responsive behavior

- Desktop (`1440px+`): 12-column grid, 64px margins, 32px gutters, 128px section rhythm.
- Tablet (`768px–1024px`): 8-column grid, 32px margins, 64px section rhythm.
- Mobile (`<768px`): fluid 4-column grid, 16px margins, 48px section rhythm.
- Content must stack logically; do not shrink headings or CTAs until unreadable.
- Hero media becomes a full-width block below the hero copy on narrow screens.
- Stats stay in a compact three-column strip on mobile and retain visible separators.

## Components

### Header

White surface, 1px separator, compact Geist navigation, cyan hover rule, and a square 4px-radius contact button. Mobile uses a native disclosure menu with a constrained, scrollable panel.

### Hero

Use `nav-dark` as the structural background. Place the eyebrow in cyan, use white Geist headings, and keep supporting text at reduced white opacity. Hero imagery uses a 4px radius, a low-contrast cyan outline, and no ornamental frame.

### Buttons

- Primary: `action-blue` background, `nav-dark` text, 4px radius.
- Secondary: transparent, `nav-dark` 1px outline, 4px radius.
- Dark CTA: white surface with `nav-dark` text.
- Focus: 2px cyan outline with a 3px offset.

### Cards and lists

Cards use white or tonal surfaces, a 1px separator, and 4–8px radius. Dark service and curated sections use `nav-panel` with white copy and cyan labels so their hierarchy matches the home showcase. Avoid shadows in the resting state. Feature lists use numbered labels, strong headings, and horizontal separators. Hover may change color or translate by 1px only.

### Forms

Labels must remain visible. Inputs use 1px separators, 4px radius, 16px body text, and cyan focus. Errors and success feedback appear in an `aria-live` region and remain readable without color alone.

### Footer

Use `nav-dark`, four aligned information columns on desktop, and one-column stacking on mobile. Keep legal and contact links easy to scan.

## Accessibility and quality gates

- Every meaningful image has concise alternative text.
- Every interactive element has a visible focus state.
- Maintain WCAG AA contrast for text and controls.
- Respect `prefers-reduced-motion`.
- Test at 390px, 768px, 1280px, and 1440px widths.
- Verify Home, Contacto, Ciberseguridad, Sobre nosotros, and the admin shell after visual changes.

## Implementation mapping

- Tokens and responsive rules: `src/app/globals.css`.
- Font loading and document metadata: `src/app/layout.tsx`.
- Header and footer: `src/components/site-shell.tsx`.
- Public page composition: `src/components/public-page.tsx`.
- Source Stitch project: `I3E Modern Corporate Web Evolution` (`9497721692359989053`).
