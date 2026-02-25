import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Check, Close } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { acceptAdminRequestApi } from '#modules/group/api/acceptAdminRequest.api';
import { denyAdminRequestApi } from '#modules/group/api/denyAdminRequest.api';
import { AdminRequest } from '#modules/group/types/adminRequest.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AdminRequestRow({
  adminRequest,
  groupSlug,
}: {
  adminRequest: AdminRequest;
  groupSlug: string;
}) {
  const [variant, setVariant] = useState<undefined | 'accept' | 'deny'>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  async function handleClickAccept() {
    setVariant('accept');
    try {
      await acceptAdminRequestApi(adminRequest.id);
      setTimeout(() => {
        queryClient.invalidateQueries(['adminRequest', { slug: groupSlug }]);
      }, 2000);
    } catch {
      setVariant(undefined);
    }
  }

  async function handleClickDeny() {
    setVariant('deny');
    try {
      await denyAdminRequestApi(adminRequest.id);
      setTimeout(() => {
        queryClient.invalidateQueries(['adminRequest']);
      }, 2000);
    } catch {
      setVariant(undefined);
    }
  }

  return (
    <Card>
      <CardContent>
        <FlexRow alignItems={'center'} gap={1}>
          <Avatar
            alt={adminRequest.user.name}
            src={adminRequest.user.picture}
            component={Link}
            to={adminRequest.user.url}
          />
          <Typography variant="caption">
            {t('group.details.requestToBeAdmin', {
              user: adminRequest.user.name,
            })}
          </Typography>
        </FlexRow>
        <Typography sx={{ mt: 2 }}>
          {adminRequest.adminRequestMessage}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {variant === undefined && (
          <>
            <Button variant="contained" onClick={handleClickAccept}>
              {t('group.details.accept')}
            </Button>
            <Button variant="outlined" onClick={handleClickDeny}>
              {t('group.details.deny')}
            </Button>
          </>
        )}
        {variant && (
          <Button
            variant="contained"
            disabled
            startIcon={variant === 'accept' ? <Check /> : <Close />}
          >
            {variant === 'accept'
              ? t('group.details.accepted')
              : t('group.details.denied')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
