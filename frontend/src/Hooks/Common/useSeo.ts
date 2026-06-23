import { useEffect } from 'react'
import { LANGS, DEFAULT_LANG } from '@/Locales'

// Per-page document head manager (no helmet dependency). Upserts title +
// meta/link tags and injects JSON-LD. Variable tags (hreflang alternates,
// JSON-LD) carry a data-seo marker so they can be cleared between pages;
// the stable og/twitter/description tags are mutated in place.

export interface SeoAlternate {
  hreflang: string // 'id' | 'en' | 'x-default'
  href: string // absolute URL
}

export interface SeoOptions {
  title: string
  description?: string
  image?: string // absolute URL
  type?: 'website' | 'article' | 'profile'
  canonical?: string // absolute URL; defaults to origin + pathname
  alternates?: SeoAlternate[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean // emit <meta name="robots" content="noindex">
}

// hreflang alternates for a public path. `pathname` includes the lang segment
// (e.g. /id/projects); we swap it per locale + add x-default.
export function buildAlternates(pathname: string): SeoAlternate[] {
  const origin = window.location.origin
  const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, '') // '' or '/projects'
  const list: SeoAlternate[] = LANGS.map(l => ({
    hreflang: l,
    href: `${origin}/${l}${rest}`,
  }))
  list.push({ hreflang: 'x-default', href: `${origin}/${DEFAULT_LANG}${rest}` })
  return list
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function clearManaged() {
  document.head
    .querySelectorAll('link[rel="alternate"][data-seo], script[data-seo-jsonld]')
    .forEach(el => el.remove())
}

export function useSeo(options: SeoOptions): void {
  const {
    title,
    description,
    image,
    type = 'website',
    canonical,
    alternates,
    jsonLd,
    noindex,
  } = options

  // Serialize the variable inputs once so the effect depends on stable strings
  // (avoids object-identity churn and exhaustive-deps noise).
  const altKey = JSON.stringify(alternates ?? [])
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const url = canonical ?? window.location.origin + window.location.pathname

    document.title = title
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertCanonical(url)

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }
    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    }

    // Variable tags: clear then rebuild from the serialized inputs.
    clearManaged()

    const alts: SeoAlternate[] = JSON.parse(altKey)
    for (const alt of alts) {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', alt.hreflang)
      link.setAttribute('href', alt.href)
      link.setAttribute('data-seo', '1')
      document.head.appendChild(link)
    }

    if (jsonLdKey) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', '1')
      script.textContent = jsonLdKey
      document.head.appendChild(script)
    }

    return clearManaged
  }, [title, description, image, type, canonical, noindex, altKey, jsonLdKey])
}
