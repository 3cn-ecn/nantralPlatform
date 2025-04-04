import { SalePreview } from '../types/sale.type';

export function getMockSalePreview(sale: Partial<SalePreview>): SalePreview {
  const id = sale.id || 0;
  return {
    id: id,
    creationDate: sale.creationDate || new Date(),
    qrCode: sale.qrCode || 'QR Code',
    itemSales: sale.itemSales || [],
  };
}
