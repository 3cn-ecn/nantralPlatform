import { Box, useTheme } from '@mui/material';

import { BackgroundImage } from '#shared/components/BackgroundImage/BackgroundImage';

interface BackgroundImageOverlayProps {
  src: string;
}

export function BackgroundImageOverlay({ src }: BackgroundImageOverlayProps) {
  const theme = useTheme();
  const bgColor = theme.palette.background.default;

  if (!src) return null;

  return (
    <Box position="relative">
      <BackgroundImage
        src={src}
        shift="bottom"
        height="80vh"
        wrapperStyle={{ overflow: 'hidden' }}
      />
      <Box
        sx={{
          background: `linear-gradient(${bgColor}80 0%, ${bgColor}FF 100%)`,
          backdropFilter: 'blur(10px)',
          position: 'absolute',
          width: '100%',
          height: '80vh',
          zIndex: -1,
        }}
      />
    </Box>
  );
}
