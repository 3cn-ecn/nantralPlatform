import { FormEvent, useState } from 'react';

import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Event } from '#modules/event/event.type';
import { addItemApi } from '#modules/nantralpay/api/addItem.api';
import { ItemFormDTO } from '#modules/nantralpay/infra/item.dto';
import { ItemForm, ItemPreview } from '#modules/nantralpay/types/item.type';
import { ItemFormFields } from '#modules/nantralpay/view/shared/ItemFormFields';
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

export function ModalAddItem({
  onClose,
  event,
}: {
  onClose: () => void;
  event: Event;
}) {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const [formValues, setFormValues] = useState<ItemForm>({
    name: '',
    price: 0,
    event: event.id,
  });
  const queryClient = useQueryClient();
  const { error, mutate, isLoading } = useMutation<
    ItemPreview,
    ApiFormError<ItemFormDTO>,
    ItemForm
  >(() => addItemApi(formValues), {
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
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader onClose={onClose}>
        Add Item
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
  );
}
