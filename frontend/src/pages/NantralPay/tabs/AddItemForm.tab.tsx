import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { addItemApi } from '#modules/nantralpay/api/addItem.api';
import { ItemForm, ItemPreview } from '#modules/nantralpay/types/item.type';
import { ItemFormFields } from '#modules/nantralpay/view/shared/ItemFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function AddItemForm() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<ItemForm>({
    name: '',
    price: 0,
  });
  const navigate = useNavigate();
  const {
    isLoading: loading,
    error,
    mutate,
  } = useMutation<
    ItemPreview,
    {
      fields: Partial<Record<keyof ItemForm, string[]>>;
      globalErrors: Partial<string[]>;
    },
    ItemForm
  >(saveItem, {
    onSuccess: () => navigate('.'),
  });

  async function saveItem(form: ItemForm) {
    return addItemApi(form);
  }

  return (
    <>
      <ItemFormFields
        formValues={formValues}
        updateFormValues={(newValues) =>
          setFormValues({ ...formValues, ...newValues })
        }
        error={error}
      />
      <Divider flexItem />
      <Spacer vertical={3} />
      <LoadingButton
        loading={loading}
        variant="contained"
        type="submit"
        size="large"
        onClick={() => mutate(formValues)}
      >
        {t('nantralpay.item.button')}
      </LoadingButton>
    </>
  );
}
