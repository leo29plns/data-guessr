import { haversineDistance } from '@/scripts/utils/haversineDistance.js';
import { Module } from '../Module/Module.js';
import { SCORE_THRESHOLDS, STATUSES } from './consts.js';

/**
 * @import { GeoDataFeature } from 'src/types/data/geodata.js'
 * @import { Coordinates } from 'src/types/coordinates.js'
 * @import { Status } from './consts.js'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class GameRound extends Module {
  /** @type {GeoDataFeature} */
  #poi;

  /** @type {Status} */
  #status = STATUSES.PENDING;

  /** @type {number | undefined} */
  #score;

  /** @type {number | undefined} */
  #distance;

  /** @type {Coordinates | undefined} */
  #guess;

  /**
   * @param {Bus} bus
   * @param {GeoDataFeature} poi - Point of interest.
   */
  constructor(bus, poi) {
    super(bus);

    this.#poi = poi;
  }

  start() {
    this.#status = STATUSES.IN_PROGRESS;
    this.bus.emit('round:started', this);
  }

  /** @param {Coordinates} coordinates */
  submitGuess(coordinates) {
    if (this.#status !== STATUSES.IN_PROGRESS) {
      throw new Error(
        `Can't submit a guess. This round is not in progress. Current: ${this.status}`,
      );
    }

    const { lat, lng } = coordinates;
    const [targetLng, targetLat] = this.#poi.geometry.coordinates;
    const distance = haversineDistance(lat, lng, targetLat, targetLng);

    this.#guess = coordinates;
    this.#distance = distance;
    this.#score = this.#calculateScore(distance);
    this.#status = STATUSES.COMPLETED;

    this.bus.emit('round:ended', this);
  }

  /**
   * Threshold-based scoring.
   *
   * @param {number} distance - Meters
   * @returns {number}
   */
  #calculateScore(distance) {
    return (
      SCORE_THRESHOLDS.find((treshold) => distance <= treshold.limit)?.score ??
      0
    );
  }

  get poi() {
    return this.#poi;
  }

  get status() {
    return this.#status;
  }

  get score() {
    return this.#score;
  }

  get distance() {
    return this.#distance;
  }

  get guess() {
    return this.#guess;
  }
}
