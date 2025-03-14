import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, Divider } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { createSaleApi } from '#modules/nantralpay/api/createSale.api';
import { adaptItem } from '#modules/nantralpay/infra/item.adapter';
import { ItemDTO } from '#modules/nantralpay/infra/item.dto';
import { Item } from '#modules/nantralpay/types/item.type';
import { SaleForm, SalePreview } from '#modules/nantralpay/types/sale.type';
import { SaleFormFields } from '#modules/nantralpay/view/shared/RegisterFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

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
  if (userQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (userQuery.isError) {
    return (
      <Alert severity="error">
        {userQuery.error.response?.data.error || userQuery.error.message}
      </Alert>
    );
  }

  // check if the query is loading
  if (itemsQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (itemsQuery.isError) {
    return (
      <Alert severity="error">
        {itemsQuery.error.response?.data.error || itemsQuery.error.message}
      </Alert>
    );
  }

  const page = itemsQuery.data;
  const itemsOfThisPage = page.results;
  const user = userQuery.data;

  async function saveSale(form: SaleForm) {
    return createSaleApi(form);
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutate(formValues);
        }}
      >
        Encaisser l&apos;utilisateur {user.user} - Montant disponible{' '}
        {user.balance} €
        <SaleFormFields
          formValues={formValues}
          updateFormValues={(newValues) =>
            setFormValues({ ...formValues, ...newValues })
          }
          error={error}
          items={itemsOfThisPage}
        />
        <Divider flexItem />
        <Spacer vertical={3} />
        <LoadingButton
          loading={loading}
          variant="contained"
          type="submit"
          size="large"
        >
          {t('nantralPay.saveSale')}
        </LoadingButton>
      </form>
    </>
  );
}
