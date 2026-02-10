import { Draggable } from '@hello-pangea/dnd';
import { DragIndicator, Edit, Verified } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';

import { Membership } from '#modules/group/types/membership.types';
import { Avatar } from '#shared/components/Avatar/Avatar';

export interface Props {
  item: Membership;
  index: number;
  onClickEdit: () => void;
}

export function MemberDraggableListItem({ item, index, onClickEdit }: Props) {
  const theme = useTheme();
  return (
    <Draggable
      draggableId={item.id.toString() + item.description}
      index={index}
    >
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={
            snapshot.isDragging
              ? { background: theme.palette.background.paper }
              : undefined
          }
        >
          <DragIndicator
            sx={{ mr: 1 }}
            color={snapshot.isDragging ? 'action' : 'disabled'}
          />
          <ListItemAvatar>
            <Avatar src={item.user.picture} alt={item.user.name}>
              <InboxIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.user.name} secondary={item.summary} />
          <ListItemIcon>
            {item.admin && <Verified color="secondary" />}
          </ListItemIcon>

          <IconButton
            title="Modifier"
            aria-label="edit"
            size="small"
            onClick={onClickEdit}
          >
            <Edit fontSize="small" />
          </IconButton>
        </ListItem>
      )}
    </Draggable>
  );
}
