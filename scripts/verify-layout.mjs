#!/usr/bin/env node
// Layout-selection smoke test (GET only, no submissions). Usage: node scripts/verify-layout.mjs <base-url>
// Asserts the server-rendered HTML of each route uses the intended chrome and marks the right nav item.
// Protected deployments need an authenticated base URL; this script never creates bypass tokens or share links.
const base = (process.argv[2] || '').replace(/\/$/, '')
if (!base) { console.error('usage: node scripts/verify-layout.mjs <base-url>'); process.exit(2) }
const NEW = [['/', 'Home'], ['/about', 'Our Story'], ['/experience', 'Experience'], ['/inquire', 'Inquire'], ['/photos', 'Our Work'], ['/films', 'Our Work'], ['/preview', 'Home']]
const LEGACY = ['/commercial', '/investment/package-builder', '/testing', '/vision']
let failed = 0
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failed++ }
const get = async (p) => { const r = await fetch(base + p, { redirect: 'manual' }); return { status: r.status, html: await r.text() } }
for (const [p, active] of NEW) {
  const { status, html } = await get(p)
  const act = [...html.matchAll(/<a[^>]*aria-current="page"[^>]*>([^<]*)/g)].map((m) => m[1])
  check(status === 200 && html.includes('data-scp-root') && !html.includes('z-[9998]') && act.includes(active), `${p}: new shell only, active="${active}" (status ${status}, active=${JSON.stringify([...new Set(act)])})`)
}
for (const p of LEGACY) {
  const { status, html } = await get(p)
  check(status === 200 && !html.includes('data-scp-root') && html.includes('z-[9998]'), `${p}: legacy chrome only (status ${status})`)
}
process.exit(failed ? 1 : 0)
