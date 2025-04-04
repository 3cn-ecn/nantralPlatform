import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, Container, Divider, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { createSaleApi } from '#modules/nantralpay/api/createSale.api';
import { SaleForm, SalePreview } from '#modules/nantralpay/types/sale.type';
import { SaleFormFields } from '#modules/nantralpay/view/shared/SaleFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface NantralPayUser {
  user: string;
  balance: number;
}

interface NantralPayUserDTO {
  user: string;
  balance: number;
}

function adaptNantralPayUser(userDto: NantralPayUserDTO): NantralPayUser {
  return { user: userDto.user, balance: userDto.balance };
}

export default function SelectionFormPanel() {
  const { uuid: qrCodeId } = useParams();

  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<SaleForm>({
    qrCode: qrCodeId || '',
    itemSales: [],
  });
  const navigate = useNavigate();
  const {
    isLoading: loading,
    error,
    mutate,
  } = useMutation<
    SalePreview,
    {
      fields: Partial<Record<keyof SaleForm, string[]>>;
      globalErrors: Partial<string[]>;
    },
    SaleForm
  >(saveSale, {
    onSuccess: () => navigate('/scan/validation'),
  });

  // Récupère l'utilisateur ayant créé le QR code ou renvoie une erreur s'il n'est pas valide
  const userQuery = useQuery<NantralPayUser, AxiosError>({
    queryFn: async () => {
      const res = await axios.get<NantralPayUserDTO>(
        '/api/nantralpay/qrcode/' + qrCodeId,
      );
      return adaptNantralPayUser(res.data);
    },
  });

  // check if the query is loading
  if (userQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (userQuery.isError) {
    if (userQuery.error.response?.data) {
      if (typeof userQuery.error.response?.data === 'string') {
        userQuery.error.message = userQuery.error.response?.data;
      }
    }
    return <Alert severity="error">{userQuery.error.message}</Alert>;
  }

  const user = userQuery.data;

  async function saveSale(form: SaleForm) {
    return createSaleApi(form);
  }

  return (
    <Container sx={{ mb: 2 }}>
      <Typography variant="h1">
        {t('nantralpay.cash-in.title', { user: user.user })}
      </Typography>
      <Typography>
        {t('nantralpay.cash-in.amount', { amount: user.balance })}
      </Typography>
      <SaleFormFields
        formValues={formValues}
        updateFormValues={(newValues) =>
          setFormValues({ ...formValues, ...newValues })
        }
        error={error}
      />
      <Divider flexItem />
      <Spacer vertical={3} />
      <LoadingButton
        loading={loading}
        variant="contained"
        type="submit"
        size="large"
        onClick={() => mutate(formValues)}
      >
        {t('nantralpay.cash-in.button')}
      </LoadingButton>
    </Container>
  );
}
