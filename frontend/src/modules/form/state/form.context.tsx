import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useReducer,
  useState,
} from 'react';

import { FormAction, formReducer } from '#modules/form/state/form.reducer';
import { FormState } from '#modules/form/types/form.type';
import { BaseLanguage } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';

export const FormContext = createContext<{
  form: FormState;
  dispatch: Dispatch<FormAction>;
  lang: BaseLanguage;
  setLang: Dispatch<SetStateAction<BaseLanguage>>;
  draggedItem: string | null;
  setDraggedItem: Dispatch<SetStateAction<string | null>>;
}>({
  form: {
    uuid: crypto.randomUUID(),
    name: 'Form',
    description: '',
    root: crypto.randomUUID(),
    nodes: {},
  },
  dispatch: () => undefined,
  lang: 'fr',
  setLang: () => undefined,
  draggedItem: null,
  setDraggedItem: () => undefined,
});

export function FormProvider({
  initialForm,
  children,
}: { initialForm: FormState } & PropsWithChildren) {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const { currentBaseLanguage } = useTranslation();
  const [lang, setLang] = useState(currentBaseLanguage);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  return (
    <FormContext.Provider
      value={{ form, dispatch, lang, setLang, draggedItem, setDraggedItem }}
    >
      {children}
    </FormContext.Provider>
  );
}
