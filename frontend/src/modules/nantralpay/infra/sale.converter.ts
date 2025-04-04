import { SaleForm } from '../types/sale.type';
import { convertItemSaleForm } from './itemSale.converter';
import { SaleFormDTO } from './sale.dto';
import { convertTransactionForm } from './transaction.converter';

export function convertSaleForm(sale: SaleForm): SaleFormDTO {
  return {
    transaction: convertTransactionForm(sale.qrCode),
    item_sales: sale.itemSales.map((itemSale) => convertItemSaleForm(itemSale)),
  };
}
