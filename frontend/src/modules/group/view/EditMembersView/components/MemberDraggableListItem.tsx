import { Draggable } from 'react-beautiful-dnd';

import { DragIndicator, Edit } from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';

import { Membership } from '#modules/group/types/membership.types';
import { Avatar } from '#shared/components/Avatar/Avatar';

export interface Props {
  item: Membership;
  index: number;
}

export function MemberDraggableListItem({ item, index }: Props) {
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
            <Avatar alt={item.student.name}>
              <InboxIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.student.name} secondary={item.summary} />

          <IconButton
            title="Modifier"
            aria-label="edit"
            size="small"
            onClick={() => null}
          >
            <Edit fontSize="small" />
          </IconButton>
        </ListItem>
      )}
    </Draggable>
  );
}
