import { ComponentProps } from 'react';

import { Image } from 'mui-image';

export function BackgroundImage({
  wrapperStyle,
  alt = '',
  ...props
}: ComponentProps<typeof Image>) {
  return (
    <Image
      wrapperStyle={{ position: 'absolute', zIndex: -1, ...wrapperStyle }}
      alt={alt}
      easing="ease-in"
      duration={400}
      {...props}
    />
  );
}
