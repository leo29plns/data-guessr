import { degToRad } from './degToRad.js';

/**
 * Computes distance between two points (using Haversine formula).
 * https://en.wikipedia.org/wiki/Haversine_formula
 *
 * @param {number} lat1 - Latitude of point A
 * @param {number} lng1 - Longitude of point A
 * @param {number} lat2 - Latitude of point B
 * @param {number} lng2 - Longitude of point B
 * @returns {number} Distance in meters
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const EARTH_RADIUS_METERS = 6371e3;

  // Convert to radians for trigonometric calculations
  const lat1Rad = degToRad(lat1);
  const lat2Rad = degToRad(lat2);

  const latDiffRad = degToRad(lat2 - lat1);
  const lngDiffRad = degToRad(lng2 - lng1);

  // Part 'a' of the formula: the square of half the chord length
  const squareHalfChord =
    Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lngDiffRad / 2) *
      Math.sin(lngDiffRad / 2);

  // Part 'c': the angular distance in radians
  const centralAngleRad =
    2 * Math.atan2(Math.sqrt(squareHalfChord), Math.sqrt(1 - squareHalfChord));

  return Math.round(EARTH_RADIUS_METERS * centralAngleRad);
};
