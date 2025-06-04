import { Sale, SalePreview } from '../types/sale.type';
import { adaptContent } from './content.adapter';
import { SaleDTO, SalePreviewDTO } from './sale.dto';

export function adaptSale(saleDto: SaleDTO): Sale {
  return {
    id: saleDto.id,
    creationDate: new Date(saleDto.creation_date),
    contents: saleDto.contents.map((itemSaleDto) => adaptContent(itemSaleDto)),
  };
}

export function adaptSalePreview(saleDto: SalePreviewDTO): SalePreview {
  return {
    id: saleDto.id,
    creationDate: new Date(saleDto.creation_date),
    contents: saleDto.contents.map((itemSaleDto) => adaptContent(itemSaleDto)),
  };
}
