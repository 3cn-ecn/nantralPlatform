import { SaleForm } from '#modules/nantralpay/types/sale.type';
import { useObjectState } from '#shared/hooks/useObjectState';

const defaultSaleFormValues: SaleForm = {
  event: null,
  contents: [],
};

export function useSaleFormValues({
  eventId,
}: {
  eventId?: number;
} = {}) {
  const defaultValues = defaultSaleFormValues;
  if (eventId) {
    defaultValues.event = eventId;
  }
  return useObjectState(defaultValues);
}
