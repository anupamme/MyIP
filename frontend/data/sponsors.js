// Sponsored placements — advertiser-supplied copy and destination links.
//
// The copy lives here rather than in locales/ because it is the advertiser's
// own wording: only the languages they hand us exist, and every other locale
// falls back to English (locale packs are for app copy, which must be complete
// in all four languages).
//
// Destination links are built with UTM tags so the advertiser can attribute
// the traffic; see sponsorLink().

export const SPONSOR_FALLBACK_LANG = 'en';

export const SPONSORS = {
  // Homepage IP-info section placement.
  vps: {
    id: 'vps',
    url: 'https://v.ps/',
    utm: {
      utm_source: 'ipcheck.ing',
      utm_medium: 'banner',
      utm_campaign: 'homepage-ipinfo',
    },
    copy: {
      en: {
        title: 'Premium VPS. Better Networks.',
        note: 'High-performance KVM VPS with global locations, fast connectivity, and IPv4 & IPv6 included.',
        cta: 'Explore V.PS',
      },
      zh: {
        title: '高性能 VPS，更优质的网络',
        note: '高性能 KVM VPS，覆盖全球多个地区，提供高速网络连接，并支持 IPv4 与 IPv6。',
        cta: '访问 V.PS',
      },
    },
  },
};

// Copy for one locale, English whenever the advertiser didn't supply that language.
export const sponsorCopy = (sponsor, lang) =>
  sponsor?.copy?.[lang] ?? sponsor?.copy?.[SPONSOR_FALLBACK_LANG] ?? null;

// Destination URL with the campaign's UTM tags, plus utm_content carrying the
// locale the visitor actually saw (which copy variant earned the click).
export const sponsorLink = (sponsor, lang) => {
  if (!sponsor?.url) return '';
  const url = new URL(sponsor.url);
  for (const [key, value] of Object.entries(sponsor.utm ?? {})) {
    url.searchParams.set(key, value);
  }
  if (lang) url.searchParams.set('utm_content', lang);
  return url.toString();
};
