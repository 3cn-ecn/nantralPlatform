import { useState } from 'react';

import { ButtonBase } from '@mui/material';
import Image from 'mui-image';

import { ImageModal } from '#shared/components/Modal/ImageModal';

type TopImageProps = {
  src: string;
};

export function TopImage({ src }: TopImageProps) {
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
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Image
          src={src}
          alt="Banner of the event"
          shift="bottom"
          style={{ aspectRatio: 16 / 9 }}
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
