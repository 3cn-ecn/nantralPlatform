import { ComponentProps } from 'react';

import { Image } from 'mui-image';

export function BackgroundImage({
  wrapperStyle,
  ...props
}: ComponentProps<typeof Image>) {
  return (
    <Image
      wrapperStyle={{ position: 'absolute', zIndex: -1, ...wrapperStyle }}
      {...props}
    />
  );
}
