import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Card, CardActionArea, Stack, Typography } from '@mui/material';

import { CreateSportEventModal } from '#modules/event/view/Modals/CreateSportEventModal';
import { useTranslation } from '#shared/i18n/useTranslation';

export function SportEventCardCreate() {
  const { t } = useTranslation();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: '250px',
          height: '270px',
          borderStyle: 'dashed',
          borderWidth: '2px',
        }}
      >
        <CardActionArea
          onClick={() => setIsOpenCreateModal(true)}
          sx={{ width: '100%', height: '100%' }}
        >
          <Stack
            spacing={1}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              p: 2,
            }}
          >
            <Add color="action" fontSize="large" />
            <Typography color="textSecondary" align="center">
              {t('sport.createCard.label')}
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>

      {isOpenCreateModal && (
        <CreateSportEventModal onClose={() => setIsOpenCreateModal(false)} />
      )}
    </>
  );
}
