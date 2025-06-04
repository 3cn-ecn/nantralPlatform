import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Alert,
  Button,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getEventDetailsApi } from '#modules/event/api/getEventDetails.api';
import { Event } from '#modules/event/event.type';
import { createSaleApi } from '#modules/nantralpay/api/createSale.api';
import { getItemListApi } from '#modules/nantralpay/api/getItemList.api';
import { useSaleFormValues } from '#modules/nantralpay/hooks/useSaleFormValues';
import { Item } from '#modules/nantralpay/types/item.type';
import {
  SaleForm,
  SaleFormErrors,
  SalePreview,
} from '#modules/nantralpay/types/sale.type';
import { PaymentStep } from '#modules/nantralpay/view/Step/PaymentStep';
import { SelectItemsStep } from '#modules/nantralpay/view/Step/SelectItemsStep';
import { SelectEventField } from '#pages/NantralPay/components/SelectEventField';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function PlaceOrderTab() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  const [event, setEvent] = useState<Event | null>(null);
  const [isEventFieldLoading, setIsEventFieldLoading] = useState(false);
  const showToast = useToast();

  const [itemsOfThisPage, setItemsOfThisPage] = useState<Item[]>([]);

  const [formValues, updateFormValues] = useSaleFormValues({
    eventId: eventId ? parseInt(eventId) : undefined,
  });

  const { error, mutate, isSuccess, isLoading } = useMutation<
    SalePreview,
    SaleFormErrors,
    SaleForm
  >(saveSale, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      setActiveStep(activeStep + 1);
      setSearchParams({ order: data.id.toString() });
    },
  });

  async function saveSale(form: SaleForm) {
    return createSaleApi(form);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  const isStepFailed = (step: number) => {
    if (step === 1 && error?.fields?.event) {
      return true;
    }
    if (step === 2 && error?.fields?.contents) {
      return true;
    }
  };

  const handleChange = useCallback(
    (val: number | null) => {
      updateFormValues({ event: val });
      setSearchParams((prev) => {
        if (!val) {
          prev.delete('event');
          return prev;
        }
        prev.set('event', val.toString());
        return prev;
      });

      // Récupère la liste des produits en vente
      const fetchItems = async () => {
        const res = getItemListApi({ event: formValues.event || 0 });
        res
          .then((data) => {
            updateFormValues({
              contents: data.results.map((item) => ({
                quantity: 0,
                item: item.id,
              })),
            });

            setItemsOfThisPage(
              data.results.map(
                (item): Item => ({
                  quantity: 0,
                  ...item,
                }),
              ),
            );
          })
          .catch((error) => showToast({ message: error, variant: 'error' }));
      };

      if (val) {
        fetchItems();
      } else {
        setItemsOfThisPage([]);
      }
    },
    [
      formValues.event,
      setItemsOfThisPage,
      setSearchParams,
      showToast,
      updateFormValues,
    ],
  );

  useEffect(() => {
    const fetchEvent = (eventId: number) => {
      setIsEventFieldLoading(true);
      getEventDetailsApi(eventId)
        .then((data) => {
          handleChange(eventId);
          setEvent(data);
          setIsEventFieldLoading(false);
          setSearchParams((prev) => {
            if (data.id) {
              prev.set('event', data.id.toString());
            } else {
              prev.delete('event');
            }
            return prev;
          });
        })
        .catch((error) => {
          updateFormValues({ event: eventId });
          setIsEventFieldLoading(false);
          setEvent(null);
          setSearchParams((prev) => {
            prev.delete('event');
            return prev;
          });
          showToast({
            message: error.message,
            variant: 'error',
          });
        });
    };
    if (formValues.event) {
      fetchEvent(formValues.event);
    }
  }, [
    formValues.event,
    handleChange,
    setSearchParams,
    showToast,
    updateFormValues,
  ]);

  return (
    <>
      <Typography
        variant="h4"
        color={'primary'}
        sx={{ alignItems: 'center', display: 'flex', columnGap: 1 }}
      >
        {t('nantralpay.cash-in.select')}
      </Typography>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel
            {...(isStepFailed(1)
              ? {
                  optional: (
                    <Typography variant="caption" color="error">
                      {t('nantralpay.order.form.stepError')}
                    </Typography>
                  ),
                  error: true,
                }
              : {})}
          >
            {t('nantralpay.order.selectEvent')}
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            {...(isStepFailed(2)
              ? {
                  optional: (
                    <Typography variant="caption" color="error">
                      {t('nantralpay.order.form.stepError')}
                    </Typography>
                  ),
                  error: true,
                }
              : {})}
          >
            {t('nantralpay.order.selectItems')}
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('nantralpay.order.payment')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{t('nantralpay.order.confirmation')}</StepLabel>
        </Step>
      </Stepper>
      {error?.globalErrors?.map((e) => {
        return (
          <>
            <Spacer vertical={3} />
            <Alert severity="error" key="0">
              {e}
            </Alert>
          </>
        );
      })}
      <Divider sx={{ my: 3 }} />
      {(activeStep === 0 || activeStep === 1) && (
        <form id="sale-form" onSubmit={onSubmit}>
          {activeStep === 0 && (
            <SelectEventField
              isLoading={isEventFieldLoading}
              formValues={formValues}
              event={event}
              handleChange={handleChange}
            />
          )}
          {formValues.event && activeStep === 1 && (
            <SelectItemsStep
              itemsOfThisPage={itemsOfThisPage}
              formValues={formValues}
              updateFormValues={updateFormValues}
              errors={error || undefined}
            />
          )}
        </form>
      )}
      {activeStep === 2 && (
        <PaymentStep
          formValues={formValues}
          itemsOfThisPage={itemsOfThisPage}
        />
      )}
      <Spacer vertical={3} />
      <FlexRow gap={2} justifyContent={'flex-end'}>
        {activeStep === 1 ? (
          <>
            <Button onClick={() => setActiveStep(activeStep - 1)}>
              {t('button.previous')}
            </Button>
            <LoadingButton
              variant="contained"
              loading={isLoading}
              type="submit"
              form="sale-form"
            >
              {t('button.next')}
            </LoadingButton>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={activeStep === 3}
          >
            {t('button.confirm')}
          </Button>
        )}
      </FlexRow>
    </>
  );
}
