import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

interface MenuHeaderProps {
  onGoBack: () => void;
  label: string;
}

export const MenuHeader = ({ onGoBack, label }: MenuHeaderProps) => {
  return (
    <ListItem>
      <ListItemIcon>
        <IconButton onClick={onGoBack}>
          <ArrowBackIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText>
        <Typography variant="h6">{label}</Typography>
      </ListItemText>
    </ListItem>
  );
};
