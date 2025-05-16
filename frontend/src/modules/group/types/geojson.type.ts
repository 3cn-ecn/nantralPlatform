import { GeoJSONObject, Id, Position } from '@turf/helpers/dist/js/lib/geojson';

interface Geometry extends GeoJSONObject {
  coordinates: Position;
}
export interface Feature extends GeoJSONObject {
  type: 'Feature';
  geometry: Geometry;
  /**
   * A value that uniquely identifies this feature in a
   * https://tools.ietf.org/html/rfc7946#section-3.2.
   */
  id: Id;
  /**
   * Properties associated with this feature.
   */
  properties: {
    slug: string;
  };
}
export interface FeatureCollection extends GeoJSONObject {
  type: 'FeatureCollection';
  features: Feature[];
}
