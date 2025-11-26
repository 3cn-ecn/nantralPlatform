import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Close as CloseIcon, OpenInNew } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from '@mui/material';

import { MapGroupPreview } from '#modules/group/types/group.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

// Styled arrow component
const Arrow = styled('div')(({ theme }) => {
  const border = `1px solid ${theme.palette.divider}`;

  return {
    width: 28,
    height: 28,
    background: theme.palette.background.paper,
    transform: 'rotate(45deg)',
    position: 'absolute',
    top: -14,
    left: '50%',
    marginLeft: -14,
    borderTop: border,
    borderLeft: border,
    zIndex: 1,
  };
});

interface CardWithArrowProps {
  children: ReactNode;
}

const CardWithArrow: FC<CardWithArrowProps> = ({ children }) => {
  return (
    <Box position="relative" top={14} display="inline-block">
      <Arrow />
      <Card variant={'outlined'}>{children}</Card>
    </Box>
  );
};

export function PopupContent({
  group,
  onClose,
}: {
  group: MapGroupPreview;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <CardWithArrow>
      <CardHeader
        title={group.address.split(',')[0]}
        avatar={<Avatar src={group.icon} alt={group.name} />}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        subheader={group.summary}
      />
      <CardContent color="secondary" sx={{ py: 0 }}>
        <Typography variant={'h3'}>{group.name}</Typography>
      </CardContent>
      <List dense={true} sx={{ py: 0 }}>
        {group.members.map((member) => (
          <ListItem disablePadding key={member.id}>
            <ListItemButton component={Link} to={member.url}>
              <ListItemAvatar>
                <Avatar src={member.picture} alt={member.name} />
              </ListItemAvatar>
              <ListItemText primary={member.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <CardActions>
        <FlexRow gap={2}>
          <Button
            component={Link}
            to={group.url}
            variant="contained"
            size={'small'}
          >
            {t('map.popup.details')}
          </Button>
          <Button
            variant="outlined"
            href={`https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${group.address}`}
            target="_blank"
            endIcon={<OpenInNew />}
            size={'small'}
          >
            {t('map.popup.go')}
          </Button>
        </FlexRow>
      </CardActions>
      <CardMedia component={'img'} src={group.banner} sx={{ maxHeight: 150 }} />
    </CardWithArrow>
  );
}
