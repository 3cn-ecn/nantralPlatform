import { Link } from 'react-router-dom';

import { Close as CloseIcon, OpenInNew } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { CardActions } from '@mui/material/';

import { MapGroupPreview } from '#modules/group/types/group.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function PopupContent({
  group,
  onClose,
}: {
  group: MapGroupPreview;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card>
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
      <CardMedia component={'img'} src={group.banner} sx={{ maxHeight: 150 }} />
    </Card>
  );
}
