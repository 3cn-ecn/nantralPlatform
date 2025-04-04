import { useState } from 'react';

import { Alert, CircularProgress, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { Event } from '#modules/event/event.type';
import { getItemListApi } from '#modules/nantralpay/api/getItemList.api';
import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { ModalDeleteItem } from '#modules/nantralpay/view/Modal/ModalDeleteItem';
import { ModalEditItem } from '#modules/nantralpay/view/Modal/ModalEditItem';
import { AddItemButton } from '#pages/NantralPay/components/AddItemButton';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ItemsList } from './components/ItemsList';

interface EditItemsViewProps {
  event: Event;
}

export function EditItemsView({ event }: EditItemsViewProps) {
  const [selected, setSelected] = useState<ItemPreview>();
  const [deleteSelected, setDeleteSelected] = useState<ItemPreview>();
  const { t } = useTranslation();

  const queryKey = ['items', { event: event.id }];

  const {
    data: items,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getItemListApi({
        event: event.id,
        pageSize: 200,
      }),
    keepPreviousData: true,
  });

  if (!items) {
    return;
  }

  return (
    <>
      <FlexAuto justifyContent={'space-between'} alignItems={'center'} mb={1}>
        <Typography variant="h3" mb={1}>
          {t('nantralpay.modal.editEvent.items')} ({items.count})
        </Typography>
        <AddItemButton event={event} />
      </FlexAuto>
      {isLoading && <CircularProgress />}
      {isError && (
        <Alert severity="error">{t('nantralpay.modal.editEvent.error')}</Alert>
      )}
      {isSuccess && items?.count > 0 && (
        <Paper>
          <ItemsList
            items={items.results}
            onClickEdit={setSelected}
            onClickDelete={setDeleteSelected}
          />
        </Paper>
      )}
      {isSuccess && items?.count === 0 && (
        <Typography>{t('nantralpay.modal.editEvent.noItems')}</Typography>
      )}
      {selected && (
        <ModalEditItem
          event={event}
          item={selected}
          onClose={() => {
            setSelected(undefined);
          }}
        />
      )}
      {deleteSelected && (
        <ModalDeleteItem
          item={deleteSelected}
          open={true}
          onClose={() => {
            setDeleteSelected(undefined);
          }}
        />
      )}
    </>
  );
}
