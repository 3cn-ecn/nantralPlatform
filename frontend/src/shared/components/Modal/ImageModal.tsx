import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton, Modal } from '@mui/material';

export function ImageModal(props: {
  url: string;
  onClose: () => void;
  open: boolean;
}) {
  const { url, onClose, open } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        margin: 0,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        bgcolor: 'rgba(0, 0, 0, 0.9)',
      }}
    >
      <>
        <img
          alt=""
          src={url}
          style={{ maxWidth: '100%', maxHeight: '100%', padding: '8px' }}
        />
        <IconButton
          onClick={onClose}
          size="large"
          sx={{ position: 'absolute', right: 0, top: 0, m: 2, color: 'white' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </>
    </Modal>
  );
}
