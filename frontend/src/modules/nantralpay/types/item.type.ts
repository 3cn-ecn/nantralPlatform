export interface Item {
  image: string;
  id: number;
  name: string;
  price: number;
  quantity: number;
  event: number;
}

export type ItemPreview = Pick<
  Item,
  'id' | 'name' | 'price' | 'event' | 'image'
>;

export interface ItemForm {
  name: string;
  price: number;
  event: number;
}
