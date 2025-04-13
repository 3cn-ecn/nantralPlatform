import { DeleteForever, Edit } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { Avatar } from '#shared/components/Avatar/Avatar';

export interface Props {
  item: ItemPreview;
  onClickDelete: () => void;
  onClickEdit: () => void;
}

export function ItemsListItem({ item, onClickDelete, onClickEdit }: Props) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={item.image} alt={item.name}>
          <InboxIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.name} secondary={item.price} />
      <IconButton
        title="Modifier"
        aria-label="edit"
        size="small"
        onClick={onClickEdit}
      >
        <Edit fontSize="small" />
      </IconButton>
      <IconButton
        title="Supprimer"
        aria-label="delete"
        size="small"
        onClick={onClickDelete}
      >
        <DeleteForever fontSize="small" />
      </IconButton>
    </ListItem>
  );
}
