import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Alert, Button, List, ListItem, Typography } from '@mui/material';

import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm } from '#modules/nantralpay/types/sale.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

interface PaymentStepProps {
  formValues: SaleForm;
  itemsOfThisPage: Item[];
}

export function PaymentStep(props: PaymentStepProps) {
  const { t, formatPrice } = useTranslation();
  const [searchParams] = useSearchParams();
  const { formValues, itemsOfThisPage } = props;
  const [order, setOrder] = useState<SaleForm>();
  const getTotal = useCallback(() => {
    let total = 0;
    order?.contents.map((item) => {
      const price = itemsOfThisPage.find((itm) => itm.id === item.item)?.price;
      if (price) {
        total += price * item.quantity;
      }
    });
    return total;
  }, [order?.contents, itemsOfThisPage]);

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId) {
      /* TODO: Get the order from API */
    } else {
      setOrder(formValues);
    }
  }, [formValues, searchParams]);

  return (
    <>
      <Alert severity={'success'}>{t('nantralpay.order.saved')}</Alert>
      <List>
        {order?.contents
          .filter((item) => item.quantity)
          .map((item) => (
            <ListItem key={item.item}>
              {item.quantity}x{' '}
              {itemsOfThisPage.find((itm) => itm.id === item.item)?.name}
            </ListItem>
          ))}
      </List>
      <Typography variant={'h3'}>{t('nantralpay.order.total')}</Typography>
      <Typography variant={'body1'}>{formatPrice(getTotal())}</Typography>
      <Typography variant={'h3'}>
        {t('nantralpay.order.paymentMethod')}
      </Typography>
      <FlexRow gap={2}>
        <Button>NantralPay</Button>
        <Button>HelloAsso</Button>
      </FlexRow>
    </>
  );
}
