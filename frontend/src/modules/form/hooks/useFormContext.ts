import { useContext } from 'react';

import { UUID } from 'crypto';

import { FormContext } from '#modules/form/state/form.context';
import { FormState, Node } from '#modules/form/types/form.type';

export function useFormContext() {
  const { form, dispatch, lang, setLang, draggedItem, setDraggedItem } =
    useContext(FormContext);

  return {
    form,
    getNode: (id: UUID) => form.nodes[id],
    setPayload: (id: UUID, payload: Node['payload']) =>
      dispatch({ type: 'payload', id, payload }),
    setForm: (state: FormState) => dispatch({ type: 'set', state }),
    addNode: (parent: UUID, payload: Node['payload'], position?: number) =>
      dispatch({ type: 'add_node', parent, payload, position }),
    removeNode: (id: UUID) => dispatch({ type: 'remove_node', id }),
    moveNode: (id: UUID, newParent: UUID, position?: number) =>
      dispatch({ type: 'move_node', id, newParent, position }),
    lang,
    setLang,
    draggedItem,
    setDraggedItem,
  };
}
