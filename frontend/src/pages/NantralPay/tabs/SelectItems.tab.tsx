import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { createSaleApi } from '#modules/nantralpay/api/createSale.api';
import { SaleForm, SalePreview } from '#modules/nantralpay/types/sale.type';
import { SaleFormFields } from '#modules/nantralpay/view/shared/SaleFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function SelectItemsTab() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<SaleForm>({
    qrCode: '',
    contents: [],
  });
  const navigate = useNavigate();
  const {
    isLoading: loading,
    error,
    mutate,
  } = useMutation<
    SalePreview,
    {
      fields: Partial<Record<keyof SaleForm, string[]>>;
      globalErrors: Partial<string[]>;
    },
    SaleForm
  >(saveSale, {
    onSuccess: () => navigate('/scan/validation'),
  });

  async function saveSale(form: SaleForm) {
    return createSaleApi(form);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <>
      <form id="sale-form" onSubmit={(e) => onSubmit(e)}>
        <SaleFormFields
          formValues={formValues}
          updateFormValues={(newValues) =>
            setFormValues({ ...formValues, ...newValues })
          }
          error={error}
        />
      </form>
      <Divider flexItem />
      <Spacer vertical={3} />
      <LoadingButton
        form="sale-form"
        loading={loading}
        variant="contained"
        type="submit"
        size="large"
      >
        {t('nantralpay.cash-in.button')}
      </LoadingButton>
    </>
  );
}
