import { ItemSaleFormDTO, ItemSalePreviewDTO } from './itemSale.dto';
import { TransactionFormDTO, TransactionPreviewDTO } from './transaction.dto';

export interface SaleDTO {
  id: number;
  creation_date: string;
  transaction: TransactionPreviewDTO;
  item_sales: ItemSalePreviewDTO[];
}

export type SalePreviewDTO = Pick<
  SaleDTO,
  'id' | 'creation_date' | 'transaction' | 'item_sales'
>;

export interface SaleFormDTO {
  transaction: TransactionFormDTO;
  item_sales: ItemSaleFormDTO[];
}
