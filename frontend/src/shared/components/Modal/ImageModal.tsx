import { Close } from '@mui/icons-material';
import { IconButton, Modal } from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';

export function ImageModal(props: {
  url: string;
  onClose: () => void;
  open: boolean;
}) {
  const { url, onClose, open } = props;

  return (
    <FlexRow justifyContent="center" height="100%" alignItems="center">
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          margin: 0,
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div>
          <IconButton
            onClick={onClose}
            size="large"
            sx={{ position: 'absolute', right: 0, top: 0, m: 2 }}
          >
            <Close fontSize="large" />
          </IconButton>

          <img alt="" src={url} style={{ maxWidth: '100%' }} />
        </div>
      </Modal>
    </FlexRow>
  );
}
