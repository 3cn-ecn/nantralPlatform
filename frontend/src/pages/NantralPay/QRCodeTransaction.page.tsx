import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

interface ItemDTO {
  id: number;
  name: string;
  price: string;
}

interface Item {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

function adaptItem(itemDTO: ItemDTO): Item {
  return {
    id: itemDTO.id,
    name: itemDTO.name,
    price: itemDTO.price,
    quantity: 0,
  };
}

function ItemForm({ item }): JSX.Element {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  return (
    <li key={item.id}>
      <label htmlFor={'quantity-' + item.id}>
        {item.name} - {item.price} €
      </label>
      <input
        type="number"
        id={'quantity-' + item.id}
        value={quantity}
        onChange={(e) => {
          item.quantity = Math.max(0, Number(e.target.value));
          setQuantity(item.quantity);
        }}
        required
      />
    </li>
  );
}

const QRCodeTransactionPage: React.FC = () => {
  const { uuid: qrCodeId } = useParams();

  const itemsQuery = useQuery<Page<Item>, AxiosError>({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await axios.get<PageDTO<ItemDTO>>('/api/nantralpay/item/');
      return adaptPage(res.data, adaptItem);
    },
  });

  // check if the query is loading
  if (itemsQuery.isLoading) {
    return <p>Loading... ⏳</p>;
  }

  // check if there is an error and show it
  if (itemsQuery.isError) {
    return <p>Error: {itemsQuery.error.message}</p>;
  }

  // if everything is ok, show the data. The types here are:
  // eventsQuery: a query object
  // eventsQuery.data: a Page object of events
  // eventsQuery.data.results: the list of events (Event[])
  const page = itemsQuery.data;
  const totalNumberOfItems = page.count;
  const itemsOfThisPage = page.results;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Appel à l'API pour créer la transaction
    const response = await fetch(
      '/api/nantralpay/cash-in-qrcode/' + qrCodeId + '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          itemsOfThisPage.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        ),
      },
    );

    if (response.ok) {
      console.log('OK');
    } else {
      console.error('Erreur lors de la création de la transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        Showing {itemsOfThisPage.length} / {totalNumberOfItems} items
      </p>
      <ul>
        {itemsOfThisPage.map((item) => (
          <ItemForm item={item} key={item.id} />
        ))}
      </ul>
      <button type="submit">Confirmer</button>
    </form>
  );
};

export default QRCodeTransactionPage;
