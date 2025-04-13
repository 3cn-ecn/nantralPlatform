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

export interface SaleForm {
  contents: ContentForm[];
  event: number | null;
}

export interface SaleFormErrors {
  fields: Partial<{
    contents: Partial<{ quantity: string[] }>[];
    event: string[];
  }>;
  globalErrors: Partial<string[]>;
}
