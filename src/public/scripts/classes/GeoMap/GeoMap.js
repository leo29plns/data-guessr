import { Map as LeafletMap, latLngBounds, marker, TileLayer } from 'leaflet';
import { Module } from '../Module/Module.js';

/**
 * @import { Marker, Layer } from 'leaflet'
 * @import { Bounds, Coordinates } from 'src/types/coordinates'
 * @import { GeoDataFeature } from 'src/types/data/geodata'
 * @import { Bus } from '@/scripts/classes/Bus/Bus.js'
 */

export class GeoMap extends Module {
  /** @type {LeafletMap} */
  #map;

  /** @type {Marker | null} */
  #pointer = null;

  /** @type {Marker | null} */
  #targetMarker = null;

  /** @type {Coordinates | null} */
  #pointerCoordinates = null;

  /** @type { Layer | null } */
  #activeLayer = null;

  /** @type {boolean} */
  #isFrozen = false;

  /** @type {Coordinates} */
  #defaultCenter;

  /** @type {number} */
  #defaultZoom;

  /**
   * @param {Bus} bus
   * @param {string} containerId
   * @param {Coordinates} center
   * @param {number} zoom
   * @param {number} minZoom
   * @param {Bounds} maxBounds
   */
  constructor(bus, containerId, center, zoom, minZoom, maxBounds) {
    super(bus);

    this.#defaultCenter = center;
    this.#defaultZoom = zoom;

    this.#map = new LeafletMap(containerId, {
      zoomControl: false,
      minZoom,
      maxBounds: latLngBounds(maxBounds.southWest, maxBounds.northEast),
    }).setView(center, zoom);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#setupClickEvent();
    this.setupListeners();
  }

  setupListeners() {
    this.bus.on('round:started', () => {
      this.#isFrozen = false;
      this.#removeMarkers();
      this.#map.setView(this.#defaultCenter, this.#defaultZoom);
    });

    this.bus.on('round:ended', (gameRound) => {
      this.#isFrozen = true;
      this.#showTarget(gameRound.poi);
    });

    this.bus.on('layer:update', (layerManager) => {
      this.#setActiveLayer(layerManager.activeLayer);
    });
  }

  zoomIn() {
    this.#map.setZoom(this.#map.getZoom() + 1);
  }

  zoomOut() {
    this.#map.setZoom(this.#map.getZoom() - 1);
  }

  #setupClickEvent() {
    this.#map.on('click', (e) => {
      if (this.#isFrozen) return;

      this.#pointerCoordinates = e.latlng;
      this.movePointer(e.latlng);

      this.bus.emit('map:moved-pointer', this);
    });
  }

  /**
   * Create or move the user's marker.
   *
   * @param {Coordinates} coords
   */
  movePointer(coords) {
    if (!this.#pointer) {
      this.#pointer = marker([coords.lat, coords.lng]).addTo(this.#map);
    } else {
      this.#pointer.setLatLng(coords);
    }
  }

  /**
   * Show the real location.
   *
   * @param {GeoDataFeature} poi
   */
  #showTarget(poi) {
    const [lng, lat] = poi.geometry.coordinates;
    const { arret_bus } = poi.properties;

    this.#targetMarker = marker([lat, lng], {
      title: arret_bus,
    })
      .addTo(this.#map)
      .bindPopup(arret_bus, {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      })
      .openPopup();

    if (this.#pointer) {
      const group = latLngBounds([
        this.#pointer.getLatLng(),
        this.#targetMarker.getLatLng(),
      ]);
      this.#map.fitBounds(group, { padding: [112, 112] });
    }
  }

  #removeMarkers() {
    if (this.#pointer) {
      this.#pointer.remove();
      this.#pointer = null;
    }

    if (this.#targetMarker) {
      this.#targetMarker.remove();
      this.#targetMarker = null;
    }

    this.#pointerCoordinates = null;
  }

  /**
   * Switch between different map layers.
   *
   * @param {Layer} nextLayer
   */
  #setActiveLayer(nextLayer) {
    if (this.#activeLayer) {
      this.#map.removeLayer(this.#activeLayer);
    }

    this.#activeLayer = nextLayer;
    this.#activeLayer.addTo(this.#map);
  }

  get pointerCoordinates() {
    if (!this.#pointerCoordinates) {
      throw new Error('No pointer coordinates');
    }

    return this.#pointerCoordinates;
  }
}
