import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from 'react';

import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { UUID } from 'crypto';

import {
  initialForm,
  JsonFormAction,
  jsonFormReducer,
  TreeState,
} from '#modules/form/state/JsonFormReducer';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { BaseLanguage } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

const FormContext = createContext<TreeState | null>(null);
const FormDispatchContext = createContext<Dispatch<JsonFormAction> | null>(
  null,
);
const SelectedLangContext = createContext<{
  lang: BaseLanguage;
  setLang: Dispatch<SetStateAction<BaseLanguage>>;
} | null>(null);

export function useJsonForm() {
  const jsonForm = useContext(FormContext);
  const dispatch = useContext(FormDispatchContext);
  const { lang, setLang } = useContext(SelectedLangContext) as {
    lang: BaseLanguage;
    setLang: Dispatch<SetStateAction<BaseLanguage>>;
  };

  if (!jsonForm || !dispatch) {
    throw new Error(
      'useJsonForm must be used within a JsonFormProvider. ' +
        'Ensure your component is wrapped with <JsonFormProvider>.',
    );
  }

  return {
    jsonForm,
    lang,
    setLang,
    addNode: (
      parentId: UUID,
      node: {
        elements?: UUID[];
        type: string;
        label?: TranslatedFieldObject;
        description?: TranslatedFieldObject;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: TranslatedFieldObject;
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
        label?: TranslatedFieldObject;
        description?: TranslatedFieldObject;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: TranslatedFieldObject;
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
    importForm: (jsonForm: JsonFormSchema) =>
      dispatch({ type: 'import', jsonForm }),
    setJsonForm: (jsonForm: TreeState) => dispatch({ type: 'set', jsonForm }),
  };
}

export function JsonFormProvider({ children }: PropsWithChildren) {
  const [form, dispatch] = useReducer(jsonFormReducer, initialForm);
  const { currentBaseLanguage } = useTranslation();
  const [lang, setLang] = useState(currentBaseLanguage);
  return (
    <FormContext.Provider value={form}>
      <FormDispatchContext.Provider value={dispatch}>
        <SelectedLangContext.Provider value={{ lang, setLang }}>
          {children}
        </SelectedLangContext.Provider>
      </FormDispatchContext.Provider>
    </FormContext.Provider>
  );
}
