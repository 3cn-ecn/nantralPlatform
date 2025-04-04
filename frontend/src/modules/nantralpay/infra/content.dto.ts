export interface ContentDto {
  id: number;
  quantity: number;
  item: number;
}

export type ContentPreviewDTO = Pick<ContentDto, 'id' | 'quantity' | 'item'>;

export type ContentFormDTO = Pick<ContentDto, 'quantity' | 'item'>;
