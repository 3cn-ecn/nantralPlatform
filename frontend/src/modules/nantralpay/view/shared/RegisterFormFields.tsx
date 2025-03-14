import { useCallback } from 'react';

import { Alert, Divider, Typography } from '@mui/material';

import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm } from '#modules/nantralpay/types/sale.type';
import { NumberField, TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

interface SaleFormFieldsProps {
  error: {
    fields: Partial<Record<keyof SaleForm, string[]>>;
    globalErrors: Partial<string[]>;
  } | null;
  formValues: SaleForm;
  updateFormValues: (newValue: Partial<SaleForm>) => void;
  items: Item[];
}

function QuantityField(
  items: Item[],
  formValues: SaleForm,
  updateFormValues,
  i,
  error,
) {
  const item = items.filter((it) => it.id == formValues.itemSales[i].item)[0];
  console.log(error);
  return (
    <NumberField
      name={'quantity-' + item.id}
      label={item.name + ' - ' + item.price + ' €'}
      value={formValues.itemSales[i].quantity}
      handleChange={(val) => {
        formValues.itemSales[i].quantity = val || 0;
        updateFormValues({
          itemSales: formValues.itemSales,
        });
        console.log(formValues);
      }}
      errors={error?.fields?.item_sales?.at(i)?.quantity}
      required
      key={item.id}
    />
  );
}

export function SaleFormFields({
  error,
  formValues,
  updateFormValues,
  items,
}: SaleFormFieldsProps) {
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
      <div style={{ display: 'block' }}>
        <TextField
          name="qr_code"
          type="hidden"
          value={formValues.qrCode}
          handleChange={useCallback(
            (val) => updateFormValues({ qrCode: val }),
            [updateFormValues],
          )}
          errors={error?.fields?.qrCode}
          required
          style={{ display: 'none' }}
        />
      </div>
      {formValues.itemSales.map((objet, i) =>
        QuantityField(items, formValues, updateFormValues, i, error),
      )}
    </>
  );
}
