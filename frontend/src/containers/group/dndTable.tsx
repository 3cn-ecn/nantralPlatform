import React from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle
} from 'react-beautiful-dnd';
import { get } from 'lodash';

// fake data generator
// const getItems = (count) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k}`,
//     primary: `item ${k}`,
//     secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined,
//   }));

interface T {
  id: number;
  dragId: string;
}

/**
 * A little function to help us reorder items
 *
 * @param list - the list of items
 * @param startIndex
 * @param endIndex 
 * @returns the re-ordered list
 */
function reorder(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Change item style when dragged.
 *
 * @param isDragging 
 * @param draggableStyle 
 * @returns new style of the item
 */
function getItemStyle(
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle
): DraggingStyle | NotDraggingStyle {
  return {
    // styles we need to apply on draggables
    ...draggableStyle,
    ...(isDragging && {
      background: "rgb(235,235,235)",
    }),
  };
};

/**
 * A table with draggable rows.
 */
export default class DndTable extends React.Component {
  constructor(props: {
    columns: { label: string; code: string }[];
    items: T[];
  }) {
    super(props);
    this.state = {
      items: props.items.map((item) => {
        item.dragId = `item-${item.id}`;
        return item;
      }),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(
      `dragEnd ${result.source.index} to  ${result.destination.index}`
    );
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {this.props.columns.map((col) => (
                <TableCell>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody component={DroppableComponent(this.onDragEnd)}>
            {this.state.items.map((item, index) => (
              <TableRow
                component={DraggableComponent(item.dragId, index)}
                key={item.id}
              >
                <TableCell scope="row">{index + 1}</TableCell>
                {this.props.columns.map((col) => (
                  <TableCell>{get(item, col.code)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

/**
 * A function that returns a draggable component
 *
 * @param id - the id of the element
 * @param index - the index for ordering the elements
 * @returns A component
 */
function DraggableComponent(id: string, index: number) {
  return function (props: any): JSX.Element {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            {...props}
          >
            {props.children}
          </TableRow>
        )}
      </Draggable>
    );
  };
};

/**
 * A function that returns a droppable component
 *
 * @param onDragEnd - function to use after dragging
 * @returns A component
 */
function DroppableComponent(onDragEnd: (result, provided) => void) {
  return function (props: any): JSX.Element {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"1"} direction="vertical">
          {(provided) => (
            <TableBody
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...props}
            >
              {props.children}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
};
