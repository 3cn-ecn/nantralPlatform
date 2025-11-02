import {
  CircleLayerSpecification,
  SymbolLayerSpecification,
} from 'react-map-gl/mapbox';

export const clusterLayer: CircleLayerSpecification = {
  id: 'clusters',
  type: 'circle',
  source: 'groups',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#1978c8',
    'circle-radius': 15,
    'circle-stroke-width': 3,
    'circle-stroke-color': '#fff',
    'circle-emissive-strength': 1.0,
  },
};

export const clusterCountLayer: SymbolLayerSpecification = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'groups',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-allow-overlap': true,
    'text-size': 15,
  },
  paint: {
    'text-color': '#fff',
  },
};

export const unclusteredPointLayer: SymbolLayerSpecification = {
  id: 'unclustered-point',
  type: 'symbol',
  source: 'groups',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': ['image', 'marker'],
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'icon-size': 0.5,
  },
};
