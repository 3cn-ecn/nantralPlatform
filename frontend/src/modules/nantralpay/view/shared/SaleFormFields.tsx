import { Grid } from '@mui/material';

import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm, SaleFormErrors } from '#modules/nantralpay/types/sale.type';
import ItemCard from '#modules/nantralpay/view/shared/ItemCard';

interface SaleFormFieldsProps {
  errors?: SaleFormErrors;
  formValues: SaleForm;
  updateFormValues: (newValue: Partial<SaleForm>) => void;
  itemsOfThisPage: Item[];
}

export function SaleFormFields({
  errors,
  formValues,
  updateFormValues,
  itemsOfThisPage,
}: SaleFormFieldsProps) {
  return (
    <>
      <Grid spacing={1} container>
        {itemsOfThisPage.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            quantity={formValues.contents[i].quantity}
            setQuantity={(val) => {
              formValues.contents[i].quantity = val || 0;
              updateFormValues({
                contents: formValues.contents,
              });
            }}
            errors={errors?.fields?.contents?.at(i)?.quantity}
          />
        ))}
      </Grid>
    </>
  );
}
