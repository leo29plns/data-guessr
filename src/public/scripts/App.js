import geodata from '@/data/geodata.geojson' with { type: 'json' };
import monumentsData from '@/data/monuments.geojson' with { type: 'json' };
import roadsData from '@/data/roads.geojson' with { type: 'json' };
import sonAir3Data from '@/data/son_air3.geojson' with { type: 'json' };
import townsData from '@/data/towns.geojson' with { type: 'json' };
import { GeoMap } from '@/scripts/classes/GeoMap/GeoMap.js';
import { ModeManager } from '@/scripts/classes/ModeManager/ModeManager.js';
import { Bus } from './classes/Bus/Bus.js';
import { GameScoreManager } from './classes/DialogManager/GameScoreManager.js';
import { Game } from './classes/Game/Game.js';
import { GuessManager } from './classes/GuessManager/GuessManager.js';
import { LayerFactory } from './classes/LayerManager/LayerFactory.js';
import { LayerManager } from './classes/LayerManager/LayerManager.js';
import { MapMetadataManager } from './classes/MapMetadataManager/MapMetadataManager.js';
import { RoundScoreManager } from './classes/PopoverManager/RoundScoreManager.js';

/**
 * @import { SelectableMode } from '@/scripts/classes/ModeManager/consts.js'
 * @import { MonumentsCollection } from 'src/types/data/monuments.js'
 * @import { RoadsCollection } from 'src/types/data/roads.js'
 * @import { SonAir3Collection } from 'src/types/data/son_air3.js'
 * @import { TownsCollection } from 'src/types/data/towns.js'
 * @import { GeoDataCollection } from 'src/types/data/geodata.js'
 */

export class App {
  /** @type {Bus} */
  #bus;

  /** @type {ModeManager} */
  #mode;

  /** @type {GeoMap} */
  #geoMap;

  /** @type {Game} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #game;

  /** @type {GuessManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #guessManager;

  /** @type {RoundScoreManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #roundScoreManager;

  /** @type {GameScoreManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #gameScoreManager;

  /** @type {MapMetadataManager} */
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: private instance
  #mapMetadataManager;

  /** @type {LayerManager} */
  #layerManager;

  constructor() {
    const idfCenter = { lat: 48.709167, lng: 2.504722 };
    const idfBoundings = {
      southWest: {
        lat: idfCenter.lat - 0.7,
        lng: idfCenter.lng - 1.3,
      },
      northEast: {
        lat: idfCenter.lat + 0.7,
        lng: idfCenter.lng + 1.3,
      },
    };

    this.#bus = new Bus();
    this.#mode = new ModeManager();
    this.#mapMetadataManager = new MapMetadataManager(
      this.#bus,
      'metadata',
      'toggle-metadata',
    );
    this.#geoMap = new GeoMap(this.#bus, 'map', idfCenter, 10, 9, idfBoundings);
    this.#layerManager = new LayerManager(this.#bus, 'layer');
    this.#guessManager = new GuessManager(this.#bus, 'guess');
    this.#roundScoreManager = new RoundScoreManager(this.#bus, 'round-score');
    this.#gameScoreManager = new GameScoreManager(this.#bus, 'game-score');
    this.#game = new Game(this.#bus);

    this.#setupZoomControls();
    this.#setupModeControls();
    this.#setupLayers();
  }

  #setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (!zoomInBtn || !zoomOutBtn) return;

    zoomInBtn.addEventListener('click', () => this.#geoMap.zoomIn());
    zoomOutBtn.addEventListener('click', () => this.#geoMap.zoomOut());
  }

  #setupModeControls() {
    /** @type {NodeListOf<HTMLInputElement>} */
    const radioInputs = document.querySelectorAll('input[name="mode"]');

    radioInputs.forEach((input) => {
      if (input.value === this.#mode.storedMode) input.checked = true;

      input.addEventListener('change', (_) => {
        this.#mode.setMode(/** @type {SelectableMode} */ (input.value));
      });
    });
  }

  #setupLayers() {
    this.#layerManager.register(
      'monuments',
      LayerFactory.createMonuments(
        /** @type {MonumentsCollection} */ (monumentsData),
      ),
      'Monuments',
    );

    this.#layerManager.register(
      'towns',
      LayerFactory.createTowns(/** @type {TownsCollection} */ (townsData)),
      'Communes',
    );

    this.#layerManager.register(
      'housing',
      LayerFactory.createHousing(/** @type {TownsCollection} */ (townsData)),
      "Prix de l'immobilier",
    );

    this.#layerManager.register(
      'roads',
      LayerFactory.createRoads(/** @type {RoadsCollection} */ (roadsData)),
      'Routes',
    );

    this.#layerManager.register(
      'bus',
      LayerFactory.createBusStops(/** @type {GeoDataCollection} */ (geodata)),
      'Arrêts de bus',
    );

    this.#layerManager.register(
      'noise',
      LayerFactory.createHeatLayer(
        /** @type {SonAir3Collection} */ (sonAir3Data),
        'son_mean',
      ),
      'Qualité sonore',
    );

    this.#layerManager.register(
      'pollution',
      LayerFactory.createHeatLayer(
        /** @type {SonAir3Collection} */ (sonAir3Data),
        'polution_mean',
      ),
      "Pollution de l'air",
    );
  }
}
