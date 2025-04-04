export interface Content {
  id: number;
  quantity: number;
  item: number;
}

export type ContentPreview = Pick<Content, 'id' | 'item' | 'quantity'>;

export interface ContentForm {
  quantity: number;
  item: number;
}
