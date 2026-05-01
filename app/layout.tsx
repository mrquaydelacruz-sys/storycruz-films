/**
 * Routes live under this `app/` directory, so Next requires a root layout here.
 * `src/app/layout.tsx` is the real implementation (fonts + Tailwind globals).
 * Without this file, pages like `/investment/package-builder` render with no CSS.
 */
export { default, metadata } from '../src/app/layout'
