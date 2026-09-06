import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Card, CardActionArea, Typography } from '@mui/material';

import { CreateSportEventModal } from '#modules/event/view/Modals/CreateSportEventModal';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
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
          height: '250px',
          borderStyle: 'dashed',
          borderWidth: '2px',
        }}
      >
        <CardActionArea
          onClick={() => setIsOpenCreateModal(true)}
          sx={{ width: '100%', height: '100%' }}
        >
          <FlexCol
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{ width: '100%', height: '100%', p: 2 }}
          >
            <Add color="action" fontSize="large" />
            <Typography color="text.secondary" align="center">
              {t('sport.createCard.label')}
            </Typography>
          </FlexCol>
        </CardActionArea>
      </Card>

      {isOpenCreateModal && (
        <CreateSportEventModal onClose={() => setIsOpenCreateModal(false)} />
      )}
    </>
  );
}
