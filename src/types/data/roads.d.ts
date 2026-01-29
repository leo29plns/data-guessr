import type { Feature, FeatureCollection, Point } from 'geojson';

export interface RoadsProperties {
  fclass: string;
  name: string;
  ref: string;
}

export type RoadsFeature = Feature<Point, RoadsProperties>;

export type RoadsCollection = FeatureCollection<Point, RoadsProperties>;
