import { useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { acceptAdminRequestApi } from '#modules/group/api/acceptAdminRequest.api';
import { denyAdminRequestApi } from '#modules/group/api/denyAdminRequest.api';
import { AdminRequest } from '#modules/group/types/adminRequest.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AdminRequestRow({
  adminRequest,
}: {
  adminRequest: AdminRequest;
}) {
  const [variant, setVariant] = useState<undefined | 'accept' | 'deny'>();
  const { t } = useTranslation();

  async function handleClickAccept() {
    setVariant('accept');
    try {
      await acceptAdminRequestApi(adminRequest.id);
    } catch {
      setVariant(undefined);
    }
  }

  async function handleClickDeny() {
    setVariant('deny');
    try {
      await denyAdminRequestApi(adminRequest.id);
    } catch {
      setVariant(undefined);
    }
  }

  return (
    <Card>
      <CardContent>
        <FlexRow alignItems={'center'} gap={1}>
          <Avatar
            alt={adminRequest.student.name}
            src={adminRequest.student.picture}
          />
          <Typography variant="caption">
            {t('group.details.requestToBeAdmin', {
              student: adminRequest.student.name,
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
