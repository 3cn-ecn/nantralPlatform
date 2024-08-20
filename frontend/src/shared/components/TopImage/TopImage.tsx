import { useState } from 'react';

import { ButtonBase } from '@mui/material';
import Image from 'mui-image';

import { ImageModal } from '#shared/components/Modal/ImageModal';

interface TopImageProps {
  src: string;
  aspectRatio?: number;
}

export function TopImage({ src, aspectRatio = 16 / 9 }: TopImageProps) {
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);

  if (!src) return null;

  return (
    <>
      <ButtonBase
        focusRipple
        onClick={() => {
          setIsOpenImageModal(true);
        }}
        sx={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Image
          src={src}
          alt="Banner of the event"
          shift="bottom"
          easing="ease-in"
          duration={400}
          shiftDuration={400}
          style={{
            aspectRatio: aspectRatio,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
      </ButtonBase>
      <ImageModal
        open={isOpenImageModal}
        onClose={() => {
          setIsOpenImageModal(false);
        }}
        url={src}
      />
    </>
  );
}
