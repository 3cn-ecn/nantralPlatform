import { Link } from 'react-router-dom';

import { Close as CloseIcon, OpenInNew } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
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
        title={group.name}
        avatar={<Avatar src={group.icon} alt={group.name} />}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        subheader={group.address}
      />
      <CardMedia component={'img'} src={group.banner} sx={{ maxHeight: 100 }} />
      <CardContent color="secondary">{group.summary}</CardContent>
      <CardActions>
        <FlexRow gap={2}>
          <Button
            component={Link}
            to={group.url}
            size="small"
            variant="contained"
          >
            {t('map.popup.details')}
          </Button>
          <Button
            size="small"
            variant="outlined"
            href={`https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${group.address}`}
            target="_blank"
            endIcon={<OpenInNew />}
          >
            {t('map.popup.go')}
          </Button>
        </FlexRow>
      </CardActions>
    </Card>
  );
}
