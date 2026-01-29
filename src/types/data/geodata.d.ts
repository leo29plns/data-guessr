import type { Feature, FeatureCollection, Point } from 'geojson';

export interface GeoDataProperties {
  arret_bus: string;
  insee: string;
  nom_comm: string;

  pop2020: number;
  superfic: number;
  naiss2022: number;
  deces2022: number;

  revMed2020: number;
  achat_maisons: number;
  achat_apparts: number;
  achat_moyen_m2: number;

  near_road: string;
  near_monu: string;
}

export type GeoDataFeature = Feature<Point, GeoDataProperties>;

export type GeoDataCollection = FeatureCollection<Point, GeoDataProperties>;
