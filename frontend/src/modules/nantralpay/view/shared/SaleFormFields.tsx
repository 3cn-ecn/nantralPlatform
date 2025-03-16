import { Alert, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { adaptItem } from '#modules/nantralpay/infra/item.adapter';
import { ItemDTO } from '#modules/nantralpay/infra/item.dto';
import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm } from '#modules/nantralpay/types/sale.type';
import { NumberField, TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

interface SaleFormFieldsProps {
  error: {
    fields: Partial<Record<keyof SaleForm, string[]>>;
    globalErrors: Partial<string[]>;
  } | null;
  formValues: SaleForm;
  updateFormValues: (newValue: Partial<SaleForm>) => void;
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
}: SaleFormFieldsProps) {
  const { t } = useTranslation();

  // Récupère la liste des produits en vente
  const itemsQuery = useQuery<Page<Item>, AxiosError>({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await axios.get<PageDTO<ItemDTO>>('/api/nantralpay/item/');
      const data = adaptPage(res.data, adaptItem);
      formValues.itemSales = data.results.map((item) => ({
        item: item.id,
        quantity: 0,
      }));
      return data;
    },
  });

  // check if the query is loading
  if (itemsQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (itemsQuery.isError) {
    if (itemsQuery.error.response?.data) {
      if (typeof itemsQuery.error.response?.data === 'string') {
        itemsQuery.error.message = itemsQuery.error.response?.data;
      }
    }
    return <Alert severity="error">{itemsQuery.error.message}</Alert>;
  }

  const page = itemsQuery.data;
  const itemsOfThisPage = page.results;

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
          handleChange={(val) => updateFormValues({ qrCode: val })}
          errors={error?.fields?.qrCode}
          required
          style={{ display: 'none' }}
        />
      </div>
      {formValues.itemSales.map((objet, i) =>
        QuantityField(itemsOfThisPage, formValues, updateFormValues, i, error),
      )}
    </>
  );
}
