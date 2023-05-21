import React, { ComponentProps } from 'react';

import { Image } from 'mui-image';

export function BackgroundImage({
  wrapperStyle,
  ...props
}: ComponentProps<typeof Image>) {
  return (
    <Image
      width="100%"
      height="100%"
      wrapperStyle={{ position: 'absolute', zIndex: -1, ...wrapperStyle }}
      {...props}
    />
  );
}
