import { Content, ContentForm, ContentPreview } from './content.type';

export interface Sale {
  id: number;
  creationDate: Date;
  qrCode: string;
  contents: Content[];
}

export type SalePreview = Pick<Sale, 'id' | 'creationDate' | 'qrCode'> & {
  contents: ContentPreview[];
};

export type SaleForm = Pick<Sale, 'qrCode'> & {
  contents: ContentForm[];
  event?: number;
};
