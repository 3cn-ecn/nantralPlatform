import { useCallback } from 'react';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { Event } from '#modules/event/event.type';
import { SaleForm, SaleFormErrors } from '#modules/nantralpay/types/sale.type';
import { AutocompleteSearchField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function SelectEventField({
  handleChange,
  formValues,
  event,
  isLoading = false,
  errors,
}: {
  handleChange: (newValue: number) => void;
  formValues: SaleForm;
  event: Event | null;
  isLoading: boolean;
  errors?: SaleFormErrors | null;
}) {
  const { t } = useTranslation();

  const fetchInitialEventOptions = useCallback(
    () => getEventListApi({ pageSize: 7 }).then((data) => data.results),
    [],
  );
  const fetchEventOptions = useCallback(
    (searchText: string) =>
      getEventListApi({ search: searchText, pageSize: 10 }).then(
        (data) => data.results,
      ),
    [],
  );

  return (
    <AutocompleteSearchField
      name="event"
      label={t('nantralpay.order.form.event.label')}
      helperText={t('nantralpay.order.form.event.helpText')}
      value={formValues.event}
      defaultObjectValue={event}
      handleChange={handleChange}
      required
      fetchInitialOptions={fetchInitialEventOptions}
      fetchOptions={fetchEventOptions}
      labelPropName="title"
      loading={isLoading}
      errors={errors?.fields?.event}
    />
  );
}
