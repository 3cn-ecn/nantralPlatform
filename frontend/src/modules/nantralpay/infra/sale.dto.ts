import { ContentFormDTO, ContentPreviewDTO } from './content.dto';
import { TransactionPreviewDTO } from './transaction.dto';

export interface SaleDTO {
  id: number;
  creation_date: string;
  transaction: TransactionPreviewDTO;
  contents: ContentPreviewDTO[];
}

export type SalePreviewDTO = Pick<
  SaleDTO,
  'id' | 'creation_date' | 'transaction' | 'contents'
>;

export interface SaleFormDTO {
  contents: ContentFormDTO[];
  event?: number;
}
