export interface ItemDTO {
  id: number;
  image: string;
  name: string;
  price: number;
  event: number;
}

export type ItemFormDTO = Pick<ItemDTO, 'name' | 'price'> & {
  event: number;
};
