import type { Feature, FeatureCollection, Point } from 'geojson';

export interface SonAir3Properties {
  son_mean: number;
  polution_mean: number;
}

export type SonAir3Feature = Feature<Point, SonAir3Properties>;

export type SonAir3Collection = FeatureCollection<Point, SonAir3Properties>;
