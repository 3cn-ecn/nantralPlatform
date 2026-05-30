import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { UUID } from 'crypto';

import {
  initialForm,
  JsonFormAction,
  jsonFormReducer,
  TreeState,
} from '#modules/form/state/JsonFormReducer';

const FormContext = createContext<TreeState | null>(null);
const FormDispatchContext = createContext<Dispatch<JsonFormAction> | null>(
  null,
);

export function useJsonForm() {
  const jsonForm = useContext(FormContext);
  const dispatch = useContext(FormDispatchContext);

  if (!jsonForm || !dispatch) {
    throw new Error(
      'useJsonForm must be used within a JsonFormProvider. ' +
        'Ensure your component is wrapped with <JsonFormProvider>.',
    );
  }

  return {
    jsonForm,
    addNode: (
      parentId: UUID,
      node: {
        elements?: UUID[];
        type: string;
        label?: string;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: string;
        schema?: JsonSchema;
      },
    ) =>
      dispatch({
        type: 'add_node',
        parentId,
        node,
      }),
    updateNode: (
      nodeId: UUID,
      node: {
        elements?: UUID[];
        type?: string;
        label?: string;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: string;
        schema?: JsonSchema;
      },
    ) =>
      dispatch({
        type: 'update_node',
        nodeId,
        node,
      }),
    removeNode: (nodeId: UUID) => dispatch({ type: 'remove_node', nodeId }),
    moveNode: (nodeId: UUID, newParentId: UUID, position?: number) =>
      dispatch({ type: 'move_node', nodeId, newParentId, position }),
    importForm: (jsonForm: { uiSchema: UISchemaElement }) =>
      dispatch({ type: 'import', jsonForm }),
    setJsonForm: (jsonForm: TreeState) => dispatch({ type: 'set', jsonForm }),
  };
}

export function JsonFormProvider({ children }: PropsWithChildren) {
  const [form, dispatch] = useReducer(jsonFormReducer, initialForm);

  return (
    <FormContext.Provider value={form}>
      <FormDispatchContext.Provider value={dispatch}>
        {children}
      </FormDispatchContext.Provider>
    </FormContext.Provider>
  );
}
