import { ItemSale, ItemSaleForm, ItemSalePreview } from './itemSale.type';

export interface Sale {
  id: number;
  creationDate: Date;
  qrCode: string;
  itemSales: ItemSale[];
}

export type SalePreview = Pick<Sale, 'id' | 'creationDate' | 'qrCode'> & {
  itemSales: ItemSalePreview[];
};

export type SaleForm = Pick<Sale, 'qrCode'> & {
  itemSales: ItemSaleForm[];
};
