import { Content, ContentForm, ContentPreview } from './content.type';

export interface Sale {
  id: number;
  creationDate: Date;
  contents: Content[];
}

export type SalePreview = Pick<Sale, 'id' | 'creationDate'> & {
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
