import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm, SaleFormErrors } from '#modules/nantralpay/types/sale.type';
import { SaleFormFields } from '#modules/nantralpay/view/shared/SaleFormFields';

export function SelectItemsStep({
  formValues,
  updateFormValues,
  itemsOfThisPage,
  errors,
}: {
  formValues: SaleForm;
  updateFormValues: (newValue: Partial<SaleForm>) => void;
  itemsOfThisPage: Item[];
  errors?: SaleFormErrors;
}) {
  return (
    <SaleFormFields
      errors={errors}
      formValues={formValues}
      updateFormValues={updateFormValues}
      itemsOfThisPage={itemsOfThisPage}
    />
  );
}
