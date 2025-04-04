export interface ItemDTO {
  id: number;
  name: string;
  price: number;
}

export type ItemFormDTO = Pick<ItemDTO, 'name' | 'price'>;
