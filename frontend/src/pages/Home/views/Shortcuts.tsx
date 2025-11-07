import { Link } from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CardContent,
  Icon,
  Typography,
} from '@mui/material';

import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function Shortcuts() {
  const { t } = useTranslation();

  return (
    <FlexRow
      mt={1}
      mb={5}
      columnGap={3}
      rowGap={1}
      flexWrap="wrap"
      justifyContent="center"
    >
      <ShortcutItem
        label={t('navbar.events')}
        path="/event/"
        iconPath="/static/img/icons/cropped/event.svg"
      />
      <ShortcutItem
        label={t('navbar.group')}
        path="/group/"
        iconPath="/static/img/icons/cropped/club.svg"
      />
      <ShortcutItem
        label={t('navbar.map')}
        path="/map/?type=colocs"
        iconPath="/static/img/icons/cropped/roommates.svg"
      />
      <ShortcutItem
        label={t('navbar.family')}
        path="/parrainage/"
        iconPath="/static/img/icons/cropped/family.svg"
        isOnBackend
      />
      <ShortcutItem
        label={t('navbar.student')}
        path="/student/"
        iconPath="/static/img/icons/cropped/list.svg"
      />
      <ShortcutItem
        label={t('navbar.signature')}
        path="/signature/"
        iconPath="/static/img/icons/cropped/sign.svg"
      />
    </FlexRow>
  );
}

interface ShortcutItemProps {
  label: string;
  path: string;
  iconPath: string;
  isOnBackend?: boolean;
}

function ShortcutItem({
  label,
  path,
  iconPath,
  isOnBackend = false,
}: ShortcutItemProps) {
  return (
    <FlexCol gap={1} alignItems="center" width="min-content">
      <Card variant="elevation" sx={{ aspectRatio: 1 }}>
        <CardActionArea
          component={Link}
          to={path}
          reloadDocument={isOnBackend}
          aria-label={label}
        >
          <CardContent>
            <Icon component="img" src={iconPath} fontSize="large" />
          </CardContent>
        </CardActionArea>
      </Card>
      <Typography variant="body2" align="center" aria-hidden>
        {label}
      </Typography>
    </FlexCol>
  );
}
