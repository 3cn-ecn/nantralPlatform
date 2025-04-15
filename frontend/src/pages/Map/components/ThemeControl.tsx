import { useEffect } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { useChangeThemeMode } from '#shared/context/CustomTheme.context';

/**
 * The ThemeControl component is responsible for changing the map theme
 * when the theme mode changes.
 */
export function ThemeControl() {
  const { currentThemeMode } = useChangeThemeMode();
  const mapRef = useMap();
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setConfigProperty(
      'basemap',
      'lightPreset',
      currentThemeMode === 'dark' ? 'night' : 'day',
    );
  }, [currentThemeMode, mapRef]);
  return <></>;
}
