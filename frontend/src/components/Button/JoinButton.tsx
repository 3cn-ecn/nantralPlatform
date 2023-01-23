import {
  PeopleAlt as PeopleIcon,
  AddCircle as PlusIcon,
  CheckCircle as CheckIcon,
  LinkOutlined as LinkIcon,
  LocalFireDepartment as ShotgunIcon,
  Cancel as Cross,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Theme,
  SxProps,
} from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface JoinButtonProps {
  variant?: 'shotgun' | 'normal' | 'form';
  link?: string;
  maxPerson?: number;
  shotgunClosed?: boolean;
  person: number;
  sx?: SxProps<Theme>;
  participating: boolean;
}

function JoinButton({
  variant,
  link,
  maxPerson,
  person,
  shotgunClosed,
  sx,
  participating,
}: JoinButtonProps): JSX.Element {
  const [selected, setSelected] = React.useState(participating);
  const [people, setPeople] = React.useState(person);
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation('translation');

  const handleClose = (unsuscribe: boolean) => {
    setOpen(false);
    if (unsuscribe) {
      setSelected(false);
      setPeople(people - 1);
    }
  };
  const onClick = (e) => {
    e.stopPropagation();
    switch (variant) {
      case 'normal':
        if (selected) {
          setOpen(true);
        } else {
          setPeople(people + 1);
          setSelected(true);
        }
        break;
      case 'shotgun':
        if (person >= maxPerson || shotgunClosed) return;
        if (selected) {
          setOpen(true);
        } else {
          setPeople(people + 1);
          setSelected(true);
        }
        break;
      case 'form':
        window.open(link, '_blank');
        break;
      default:
    }
  };
  const getFirstIcon = () => {
    switch (variant) {
      case 'shotgun':
        return <ShotgunIcon />;
      case 'form':
        return <LinkIcon />;
      default:
        return <PeopleIcon />;
    }
  };
  const getSecondIcon = () => {
    if (variant === 'normal') return selected ? <CheckIcon /> : <PlusIcon />;
    if (variant === 'shotgun') {
      if (person >= maxPerson || shotgunClosed) return <Cross />;
      if (people === maxPerson) return <CheckIcon />;
      return selected ? <CheckIcon /> : <PlusIcon />;
    }
    return null;
  };
  const getText = () => {
    switch (variant) {
      case 'normal':
        return people;
      case 'shotgun':
        return `${people}/${maxPerson}`;
      case 'form':
        return t('button.joinButton.register');
      default:
        return people;
    }
  };
  let color: 'error' | 'success' | 'primary';
  if ((people >= maxPerson || shotgunClosed) && variant === 'shotgun') {
    color = 'error';
  } else if (selected) {
    color = 'success';
  } else {
    color = 'primary';
  }
  return (
    <>
      <Button
        onClick={(e) => onClick(e)}
        variant="contained"
        startIcon={getFirstIcon()}
        color={color}
        endIcon={getSecondIcon()}
        sx={sx}
        title="test"
      >
        {getText()}
      </Button>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Se désinscrire ?</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('button.joinButton.title')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(false)}>
            Annuler
          </Button>
          <Button
            onClick={() => handleClose(true)}
            autoFocus
            variant="contained"
          >
            Se désinscrire
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

JoinButton.defaultProps = {
  variant: 'normal',
  link: '',
  maxPerson: 0,
  shotgunClosed: false,
  sx: {},
};

export default JoinButton;
