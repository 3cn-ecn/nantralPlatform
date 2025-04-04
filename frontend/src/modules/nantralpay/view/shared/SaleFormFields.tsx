import { useCallback } from 'react';

import { Alert, Divider, Typography } from '@mui/material';

import { getNantralPayEventListApi } from '#modules/nantralpay/api/getNantralPayEventList.api';
import { useItemListQuery } from '#modules/nantralpay/hooks/useItemList.query';
import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm } from '#modules/nantralpay/types/sale.type';
import {
  AutocompleteSearchField,
  NumberField,
  TextField,
} from '#shared/components/FormFields';
import ButtonNumberField from '#shared/components/FormFields/ButtonNumberField';
import { useTranslation } from '#shared/i18n/useTranslation';

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
  const item = items.filter((it) => it.id == formValues.contents[i].item)[0];
  console.log(error);
  return (
    <>
      <ButtonNumberField />
      <NumberField
        name={'quantity-' + item.id}
        label={item.name + ' - ' + item.price + ' €'}
        value={formValues.contents[i].quantity}
        handleChange={(val) => {
          formValues.contents[i].quantity = val || 0;
          updateFormValues({
            itemSales: formValues.contents,
          });
          console.log(formValues);
        }}
        errors={error?.fields?.item_sales?.at(i)?.quantity}
        required
        key={item.id}
      />
    </>
  );
}

export function SaleFormFields({
  error,
  formValues,
  updateFormValues,
}: SaleFormFieldsProps) {
  const { t } = useTranslation();

  const handleEventChange = (val: number) => {
    useCallback(
      (val: number) => updateFormValues({ event: val }),
      [updateFormValues],
    );
  };

  const fetchInitialGroupOptions = useCallback(
    () =>
      getNantralPayEventListApi({ pageSize: 7 }).then((data) => data.results),
    [],
  );
  const fetchGroupOptions = useCallback(
    (searchText: string) =>
      getNantralPayEventListApi({ search: searchText, pageSize: 10 }).then(
        (data) => data.results,
      ),
    [],
  );

  // Récupère la liste des produits en vente
  const itemsQuery = useItemListQuery({ event: formValues.event ?? 0 });

  // check if the query is loading
  if (itemsQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (itemsQuery.isError) {
    return <Alert severity="error">{itemsQuery.error.message}</Alert>;
  }

  const page = itemsQuery.data;
  const itemsOfThisPage = page.results.map(
    (item): Item => ({
      quantity: 0,
      ...item,
    }),
  );

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
        {t('nantralpay.cash-in.select')}
      </Typography>
      <AutocompleteSearchField
        name="event"
        label={t('nantralpay.form.event.label')}
        helperText={t('nantralpay.form.event.helpText')}
        value={formValues.event ?? null}
        handleChange={handleEventChange}
        defaultObjectValue={prevData?.event || null}
        errors={error?.fields?.event}
        required
        fetchInitialOptions={fetchInitialGroupOptions}
        fetchOptions={fetchGroupOptions}
        labelPropName="name"
        imagePropName="icon"
      />
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
      {formValues.contents.map((objet, i) =>
        QuantityField(itemsOfThisPage, formValues, updateFormValues, i, error),
      )}
    </>
  );
}
