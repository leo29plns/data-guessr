import { describe, expect, it } from 'vitest';
import { haversineDistance } from '@/scripts/utils/haversineDistance.js';

describe('haversineDistance', () => {
  const PARIS = { lat: 48.8566, lng: 2.3522 };
  const LONDON = { lat: 51.5074, lng: -0.1278 };
  const NEW_YORK = { lat: 40.7128, lng: -74.006 };

  it('returns 0 when start and end points are the same', () => {
    const distance = haversineDistance(
      PARIS.lat,
      PARIS.lng,
      PARIS.lat,
      PARIS.lng,
    );
    expect(distance).toBe(0);
  });

  it('calculates correct distance between Paris and London (~344km)', () => {
    const distance = haversineDistance(
      PARIS.lat,
      PARIS.lng,
      LONDON.lat,
      LONDON.lng,
    );

    // +/- 1km
    expect(distance).toBeGreaterThan(342500);
    expect(distance).toBeLessThan(344500);
  });

  it('calculates correct distance between Paris and New York (~5837km)', () => {
    const distance = haversineDistance(
      PARIS.lat,
      PARIS.lng,
      NEW_YORK.lat,
      NEW_YORK.lng,
    );

    // +/- 1km
    expect(distance).toBeGreaterThan(5830000);
    expect(distance).toBeLessThan(5845000);
  });

  it('is commutative (Distance A -> B equals B -> A)', () => {
    const distAB = haversineDistance(
      PARIS.lat,
      PARIS.lng,
      NEW_YORK.lat,
      NEW_YORK.lng,
    );
    const distBA = haversineDistance(
      NEW_YORK.lat,
      NEW_YORK.lng,
      PARIS.lat,
      PARIS.lng,
    );

    expect(distAB).toBe(distBA);
  });

  it('handles 1 degree of latitude correctly (~111km)', () => {
    // 1 degree is ~111.19 km
    const distance = haversineDistance(0, 0, 1, 0);

    expect(distance).toBeGreaterThan(111000);
    expect(distance).toBeLessThan(111500);
  });
});
