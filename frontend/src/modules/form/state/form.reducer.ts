import { UUID } from 'crypto';
import { cloneDeep } from 'lodash';

import { addNode, moveNode, removeNode } from '#modules/form/state/utils';
import { FormState, Node } from '#modules/form/types/form.type';

export type FormAction =
  | {
      type: 'add_node';
      parent: UUID;
      payload: Node['payload'];
      position?: number;
    }
  | {
      type: 'remove_node';
      id: UUID;
    }
  | {
      type: 'move_node';
      id: UUID;
      newParent: UUID;
      position?: number;
    }
  | {
      type: 'set';
      state: FormState;
    }
  | {
      type: 'payload';
      id: UUID;
      payload: Node['payload'];
    };

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'add_node':
      return addNode(
        cloneDeep(state),
        action.parent,
        action.payload,
        action.position,
      );
    case 'remove_node':
      return removeNode(cloneDeep(state), action.id);
    case 'move_node':
      return moveNode(
        cloneDeep(state),
        action.id,
        action.newParent,
        action.position,
      );
    case 'set':
      return cloneDeep(action.state);
    case 'payload':
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.id]: {
            ...state.nodes[action.id],
            payload: cloneDeep(action.payload),
          },
        },
      };
    default:
      throw new Error(
        `Unknown action type in reducer: ${JSON.stringify(action)}`,
      );
  }
}
