import type { Feature, FeatureCollection, Point } from 'geojson';

export interface TownsProperties {
  insee: string;
  nom: string;

  pop2020: number;
  superfic: number;
  naiss2022: number;
  deces2020: number;

  revMed2020: number;

  NbMaisons: number;
  NbApparts: number;
  PropMaison: number;
  PropAppart: number;
  Prixm2Moyen: number;
}

export type TownsFeature = Feature<Point, TownsProperties>;

export type TownsCollection = FeatureCollection<Point, TownsProperties>;
