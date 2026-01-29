import type { Feature, FeatureCollection, Point } from 'geojson';

export interface MonumentsProperties {
  nom_du_site: string;
  commentaires: string;
}

export type MonumentsFeature = Feature<Point, MonumentsProperties>;

export type MonumentsCollection = FeatureCollection<Point, MonumentsProperties>;
