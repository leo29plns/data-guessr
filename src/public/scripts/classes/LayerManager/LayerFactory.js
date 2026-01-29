/** biome-ignore-all lint/complexity/noStaticOnlyClass: Factory */
import { circleMarker, geoJSON, layerGroup, rectangle } from 'leaflet';

/**
 * @import { Path, LatLngBoundsExpression } from 'leaflet'
 * @import { MonumentsCollection } from 'src/types/data/monuments'
 * @import { TownsCollection } from 'src/types/data/towns'
 * @import { RoadsCollection } from 'src/types/data/roads'
 * @import { SonAir3Collection } from 'src/types/data/son_air3'
 * @import { GeoDataCollection } from 'src/types/data/geodata'
 */

// --- Constants & Helper Functions from "Crade" version ---
const CELL_LAT_SIZE = 0.00587;
const CELL_LNG_SIZE = 0.00778;

const STYLES = {
  roads: {
    pri: { color: '#e74c3c', weight: 4, opacity: 0.9 },
    sec: { color: '#e67e22', weight: 3, opacity: 0.8 },
    ter: { color: '#f1c40f', weight: 2, opacity: 0.7 },
    default: { color: '#3498db', weight: 1.5, opacity: 0.6 },
  },
  towns: {
    base: {
      color: '#2d6a4f',
      weight: 1.5,
      opacity: 1,
      fillColor: '#95d5b2',
      fillOpacity: 0.5,
    },
    hover: {
      color: '#1b4332',
      weight: 3,
      fillColor: '#40916c',
      fillOpacity: 0.7,
    },
  },
  monuments: {
    radius: 6,
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillColor: '#3498db',
    fillOpacity: 0.9,
  },
  busStops: {
    radius: 5,
    color: '#ffffff',
    weight: 1.5,
    opacity: 1,
    fillColor: '#9b59b6',
    fillOpacity: 0.85,
  },
};

/** @param {number} val */
function getHeatStyle(val) {
  const normalized = Math.max(0, Math.min(1, (val - 1) / 2));
  const opacity = 0.4 + normalized * 0.45;
  const r = normalized <= 0.5 ? Math.round(255 * (normalized * 2)) : 255;
  const g =
    normalized <= 0.5 ? 200 : Math.round(200 * (1 - (normalized - 0.5) * 2));
  return { color: `rgb(${r}, ${g}, 50)`, opacity };
}

/** @param {number} price */
function getHousingColor(price) {
  const normalized = Math.max(0, Math.min(1, (price - 1500) / (6000 - 1500)));
  const r = normalized <= 0.5 ? Math.round(255 * (normalized * 2)) : 255;
  const g =
    normalized <= 0.5 ? 200 : Math.round(200 * (1 - (normalized - 0.5) * 2));
  return `rgb(${r}, ${g}, 50)`;
}

export class LayerFactory {
  /** @param {MonumentsCollection} data */
  static createMonuments(data) {
    return geoJSON(data, {
      pointToLayer: (_, latlng) => circleMarker(latlng, STYLES.monuments),
      onEachFeature: (f, l) =>
        l.bindTooltip(f.properties.nom_du_site || 'Monument inconnu', {
          direction: 'top',
          offset: [0, -6],
        }),
    });
  }

  /** @param {TownsCollection} data */
  static createTowns(data) {
    return geoJSON(data, {
      style: STYLES.towns.base,
      onEachFeature: (f, l) => {
        const p = f.properties;
        l.bindTooltip(
          `<strong>${p.nom}</strong><br>Pop: ${p.pop2020.toLocaleString()}<br>Revenu: ${p.revMed2020} €`,
          { sticky: true, className: 'map-tooltip', offset: [0, -10] },
        );
        l.on('mouseover', () =>
          /** @type {Path} */ (l).setStyle(STYLES.towns.hover),
        );
        l.on('mouseout', () =>
          /** @type {Path} */ (l).setStyle(STYLES.towns.base),
        );
      },
    });
  }

  /** @param {TownsCollection} data */
  static createHousing(data) {
    return geoJSON(data, {
      style: (f) => {
        const price = f?.properties.Prixm2Moyen ?? 0;
        const hasData = price > 0;
        return {
          color: '#333',
          weight: 1,
          opacity: 1,
          fillColor: hasData ? getHousingColor(price) : '#999',
          fillOpacity: hasData ? 0.7 : 0.4,
        };
      },
      onEachFeature: (f, l) => {
        const p = f.properties;
        const content =
          p.Prixm2Moyen > 0
            ? `<strong>${p.nom}</strong><br>Prix: ${p.Prixm2Moyen.toLocaleString()} €/m²`
            : `<strong>${p.nom}</strong><br>Pas de données`;
        l.bindTooltip(content, {
          sticky: true,
          className: 'map-tooltip',
          offset: [0, -10],
        });
        l.on('mouseover', () =>
          /** @type {Path} */ (l).setStyle({ weight: 3, fillOpacity: 0.9 }),
        );
        l.on('mouseout', () =>
          /** @type {Path} */ (l).setStyle({
            weight: 1,
            fillOpacity: f.properties.Prixm2Moyen > 0 ? 0.7 : 0.4,
          }),
        );
      },
    });
  }

  /** @param {RoadsCollection} data */
  static createRoads(data) {
    return geoJSON(data, {
      style: (f) => {
        const fclass = f?.properties?.fclass;
        const styleKey = /** @type {keyof typeof STYLES.roads} */ (fclass);

        return STYLES.roads[styleKey] || STYLES.roads.default;
      },
      onEachFeature: (f, l) => {
        const { name, ref } = f.properties;
        if (name || ref)
          l.bindTooltip(name ? (ref ? `${name} (${ref})` : name) : ref, {
            sticky: true,
          });
      },
    });
  }

  /** @param {SonAir3Collection} data
   * @param {'son_mean' | 'polution_mean'} property */
  static createHeatLayer(data, property) {
    const group = layerGroup();
    const labelMap = { son_mean: 'Bruit', polution_mean: 'Pollution' };

    for (const f of data.features) {
      const [lng, lat] = f.geometry.coordinates;
      const val = f.properties[property];
      const { color, opacity } = getHeatStyle(val);
      const bounds = [
        [lat - CELL_LAT_SIZE / 2, lng - CELL_LNG_SIZE / 2],
        [lat + CELL_LAT_SIZE / 2, lng + CELL_LNG_SIZE / 2],
      ];

      rectangle(/** @type {LatLngBoundsExpression} */ (bounds), {
        color,
        weight: 0,
        opacity,
        fillColor: color,
        fillOpacity: opacity,
      })
        .bindTooltip(
          `${labelMap[property]} : ${val <= 1.5 ? 'Correct' : val <= 2.5 ? 'Dégradé' : 'Horrible'}`,
          { direction: 'top', offset: [0, -5] },
        )
        .addTo(group);
    }
    return group;
  }

  /** @param {GeoDataCollection} data */
  static createBusStops(data) {
    return geoJSON(data, {
      pointToLayer: (_, latlng) => circleMarker(latlng, STYLES.busStops),
      onEachFeature: (f, l) => {
        const p = f.properties;
        const content = `<strong>${p.arret_bus}</strong><br>${p.nom_comm}${p.near_road ? `<br>${p.near_road}` : ''}`;
        l.bindTooltip(content, { direction: 'top', offset: [0, -5] });
      },
    });
  }
}
