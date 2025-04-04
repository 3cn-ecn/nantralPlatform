import { FormEvent, useState } from 'react';

import { MoreHoriz } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Event } from '#modules/event/event.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { editItemApi } from '../../api/editItem.api';
import { convertItemToForm } from '../../hooks/useItemFormValues';
import { ItemFormDTO } from '../../infra/item.dto';
import { ItemForm, ItemPreview } from '../../types/item.type';
import { ItemFormFields } from '../../view/shared/ItemFormFields';
import { ModalDeleteItem } from './ModalDeleteItem';

export function ModalEditItem({
  onClose,
  item,
  event,
}: {
  onClose: () => void;
  item: ItemPreview;
  event: Event;
}) {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<ItemForm>(
    convertItemToForm(item, event.id),
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const queryClient = useQueryClient();

  const { error, mutate, isLoading } = useMutation<
    ItemPreview,
    ApiFormError<ItemFormDTO>,
    ItemForm
  >(() => editItemApi(item.id, formValues), {
    onSuccess: () => {
      queryClient.invalidateQueries(['items', { event: event.id }]);
      onClose();
    },
  });

  function updateFormValues(val: Partial<ItemForm>) {
    setFormValues({ ...formValues, ...val });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <>
      <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
        <ResponsiveDialogHeader onClose={onClose}>
          {t('nantralpay.modal.editItem')}
          <Spacer flex={1} />
        </ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <form id="edit-item-form" onSubmit={(e) => onSubmit(e)}>
            <ItemFormFields
              error={error}
              formValues={formValues}
              updateFormValues={updateFormValues}
            />
          </form>
          <FlexRow justifyContent={'left'}>
            <IconButton onClick={handleClick}>
              <MoreHoriz />
            </IconButton>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left', // Anchor menu to the left of the button
              }}
            >
              <MenuItem onClick={() => setModalOpen(true)}>
                <Typography color="primary">Supprimer</Typography>
              </MenuItem>
            </Menu>
          </FlexRow>
        </ResponsiveDialogContent>
        <ResponsiveDialogFooter>
          <Button variant="text" onClick={() => onClose()}>
            {t('button.cancel')}
          </Button>
          <LoadingButton
            form="edit-item-form"
            type="submit"
            loading={isLoading}
            variant="contained"
          >
            {t('button.confirm')}
          </LoadingButton>
        </ResponsiveDialogFooter>
      </ResponsiveDialog>
      <ModalDeleteItem
        open={modalOpen}
        onClose={(deleted) => {
          setModalOpen(false);
          if (deleted) {
            onClose();
          }
        }}
        item={item}
      />
    </>
  );
}
