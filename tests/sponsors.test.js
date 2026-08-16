// Specs for the sponsored-placement data: locale fallback and UTM link building.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SPONSORS,
  SPONSOR_FALLBACK_LANG,
  sponsorCopy,
  sponsorLink,
} from '../frontend/data/sponsors.js';

const COPY_FIELDS = ['title', 'note', 'cta'];

describe('SPONSORS', () => {
  it('gives every sponsor a url, English copy, and the three UTM tags', () => {
    for (const [key, sponsor] of Object.entries(SPONSORS)) {
      assert.equal(sponsor.id, key, `${key}: id must match its map key`);
      assert.match(sponsor.url, /^https:\/\//, `${key}: url must be https`);
      assert.deepEqual(
        Object.keys(sponsor.utm).sort(),
        ['utm_campaign', 'utm_medium', 'utm_source'],
        `${key}: utm tags`
      );
      assert.ok(sponsor.copy[SPONSOR_FALLBACK_LANG], `${key}: needs English copy`);
    }
  });

  it('gives every supplied locale the full set of copy fields', () => {
    for (const [key, sponsor] of Object.entries(SPONSORS)) {
      for (const [lang, copy] of Object.entries(sponsor.copy)) {
        for (const field of COPY_FIELDS) {
          assert.ok(copy[field], `${key}.${lang}: missing ${field}`);
        }
      }
    }
  });
});

describe('sponsorCopy()', () => {
  const sponsor = SPONSORS.vps;

  it('returns the locale the advertiser supplied', () => {
    assert.equal(sponsorCopy(sponsor, 'zh').cta, '访问 V.PS');
    assert.equal(sponsorCopy(sponsor, 'en').cta, 'Explore V.PS');
  });

  it('falls back to English for locales the advertiser did not supply', () => {
    const english = sponsorCopy(sponsor, 'en');
    assert.deepEqual(sponsorCopy(sponsor, 'fr'), english);
    assert.deepEqual(sponsorCopy(sponsor, 'ru'), english);
    assert.deepEqual(sponsorCopy(sponsor, undefined), english);
  });

  it('returns null for an unknown sponsor', () => {
    assert.equal(sponsorCopy(undefined, 'en'), null);
  });
});

describe('sponsorLink()', () => {
  const sponsor = SPONSORS.vps;

  it('appends the campaign UTM tags plus the rendered locale', () => {
    const params = new URL(sponsorLink(sponsor, 'zh')).searchParams;
    assert.equal(params.get('utm_source'), 'ipcheck.ing');
    assert.equal(params.get('utm_medium'), 'banner');
    assert.equal(params.get('utm_campaign'), 'homepage-ipinfo');
    assert.equal(params.get('utm_content'), 'zh');
  });

  it('keeps the advertiser origin intact', () => {
    assert.equal(new URL(sponsorLink(sponsor, 'en')).origin, new URL(sponsor.url).origin);
  });

  it('omits utm_content when no locale is known', () => {
    assert.equal(new URL(sponsorLink(sponsor, '')).searchParams.get('utm_content'), null);
  });

  it('preserves query params already on the destination url', () => {
    const withQuery = { ...sponsor, url: 'https://v.ps/?aff=42' };
    const params = new URL(sponsorLink(withQuery, 'en')).searchParams;
    assert.equal(params.get('aff'), '42');
    assert.equal(params.get('utm_source'), 'ipcheck.ing');
  });

  it('returns an empty string for a sponsor without a url', () => {
    assert.equal(sponsorLink(undefined, 'en'), '');
  });
});
