import { STATUSES } from '../GameRound/consts.js';
import { GameRound } from '../GameRound/GameRound.js';
import { GeoData } from '../GeoData/GeoData.js';
import { Module } from '../Module/Module.js';
import { ROUNDS_COUNT } from './consts.js';

/**
 * @import { Coordinates } from 'src/types/coordinates.js'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class Game extends Module {
  /** @type {GeoData} */
  #geoData;

  /** @type {GameRound[]} */
  #rounds = [];

  /** @param {Bus} bus */
  constructor(bus) {
    super(bus);

    this.#geoData = new GeoData();

    this.createRounds(ROUNDS_COUNT);
    this.startNextRound();
    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('guess:submitted', (guessManager) =>
      this.handleGuess(guessManager.coordinates),
    );

    this.bus.on('dialog:next-round', () => this.startNextRound());

    this.bus.on('ui:game-restart', () => this.restart());
  }

  startNextRound() {
    const nextRound = this.#nextRound;

    if (!nextRound) {
      this.bus.emit('game:ended', this);
      return;
    }

    nextRound.start();
  }

  /** @param {number} count */
  createRounds(count) {
    const locations = this.#geoData.getRandomLocations(count);

    this.#rounds = locations.map(
      (location) => new GameRound(this.bus, location),
    );
  }

  /**
   * @param {Coordinates} formData
   */
  handleGuess(formData) {
    this.currentRound?.submitGuess(formData);
  }

  restart() {
    this.createRounds(ROUNDS_COUNT);
    this.startNextRound();
  }

  get currentRound() {
    return this.#rounds.find((round) => round.status === STATUSES.IN_PROGRESS);
  }

  get #nextRound() {
    return this.#rounds.find((round) => round.status === STATUSES.PENDING);
  }

  get totalScore() {
    return this.#rounds.reduce((total, round) => total + (round.score ?? 0), 0);
  }
}
