import { SaleForm } from '../types/sale.type';
import { convertContentForm } from './content.converter';
import { SaleFormDTO } from './sale.dto';
import { convertTransactionForm } from './transaction.converter';

export function convertSaleForm(sale: SaleForm): SaleFormDTO {
  return {
    transaction: convertTransactionForm(sale.qrCode),
    contents: sale.contents.map((itemSale) => convertContentForm(itemSale)),
    event: sale.event,
  };
}
