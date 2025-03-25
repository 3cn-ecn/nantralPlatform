import { FormEvent, useState } from 'react';

import { MoreHoriz } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editItemApi } from '#modules/nantralpay/api/editItem.api';
import { convertItemForm } from '#modules/nantralpay/infra/item.converter';
import { ItemFormDTO } from '#modules/nantralpay/infra/item.dto';
import { ItemForm, ItemPreview } from '#modules/nantralpay/types/item.type';
import { ItemFormFields } from '#modules/nantralpay/view/shared/ItemFormFields';
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

import { ModalDeleteItem } from './ModalDeleteItem';

export function ModalEditItem({
  onClose,
  item,
}: {
  onClose: () => void;
  item: ItemPreview;
}) {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<ItemForm>(convertItemForm(item));
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
      queryClient.invalidateQueries(['items']);
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
          Edit item
          <Spacer flex={1} />
        </ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <form id="edit-group-form" onSubmit={(e) => onSubmit(e)}>
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
            form="edit-group-form"
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
