import { List } from '@mui/material';

import { ItemPreview } from '#modules/nantralpay/types/item.type';

import { ItemsListItem } from './ItemsListItem';

export interface ItemsListProps {
  items: ItemPreview[];
  onClickEdit: (item: ItemPreview) => void;
  onClickDelete: (item: ItemPreview) => void;
}

export function ItemsList({
  items,
  onClickEdit,
  onClickDelete,
}: ItemsListProps) {
  return (
    <List>
      {items.map((item: ItemPreview) => (
        <ItemsListItem
          item={item}
          key={item.id}
          onClickEdit={() => onClickEdit(item)}
          onClickDelete={() => onClickDelete(item)}
        />
      ))}
    </List>
  );
}
