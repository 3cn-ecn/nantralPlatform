import { useState } from 'react';

import { OpenInNew } from '@mui/icons-material';
import { Button } from '@mui/material';

import { NumberField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HelloAssoCheckout() {
  const { t, formatPrice } = useTranslation();

  const [amount, setAmount] = useState(0);
  return (
    <form>
      <NumberField value={amount} handleChange={(val) => setAmount(val || 0)} />
      <Button
        variant="contained"
        color="info"
        endIcon={<OpenInNew />}
        size={'large'}
        type={'submit'}
      >
        {t('nantralpay.helloasso.checkout', { amount: formatPrice(amount) })}
      </Button>
    </form>
  );
}
