import { useCallback } from 'react';

import { Alert, Divider, Typography } from '@mui/material';

import { ItemForm } from '#modules/nantralpay/types/item.type';
import { NumberField, TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

interface ItemFormFieldsProps {
  error: {
    fields: Partial<Record<keyof ItemForm, string[]>>;
    globalErrors: Partial<string[]>;
  } | null;
  formValues: ItemForm;
  updateFormValues: (newValue: Partial<ItemForm>) => void;
}

export function ItemFormFields({
  error,
  formValues,
  updateFormValues,
}: ItemFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      {error?.globalErrors?.map((e) => {
        return (
          <Alert severity="error" key="0">
            {e}
          </Alert>
        );
      })}
      <Typography
        variant="h4"
        color={'primary'}
        sx={{ alignItems: 'center', display: 'flex', columnGap: 1 }}
      >
        {t('nantralpay.selectItems')}
      </Typography>
      <Divider sx={{ marginTop: 1 }} />
      <TextField
        name="qr_code"
        type="text"
        value={formValues.name}
        handleChange={useCallback(
          (val) => updateFormValues({ name: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.name}
        required
      />
      <NumberField
        name="qr_code"
        value={formValues.price}
        handleChange={useCallback(
          (val) => {
            console.log(val);
            updateFormValues({ price: val || 0 });
          },
          [updateFormValues],
        )}
        type="decimal"
        errors={error?.fields?.price}
        required
      />
    </>
  );
}
