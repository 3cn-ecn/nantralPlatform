import { useCallback, useMemo } from 'react';

import { UUID } from 'crypto';
import { set } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { RichTextField } from '#shared/components/FormFields';

export function LabelLayout({ nodeId }: { nodeId: UUID }) {
  const { form, setForm, lang } = useFormContext();

  const text = useMemo(
    () => form.nodes[nodeId].payload.translation[lang].text,
    [form.nodes, lang, nodeId],
  );

  const setText = useCallback(
    (val: string) => {
      set(form, `nodes.${nodeId}.payload.translation.${lang}.text`, val);
      setForm(form);
    },
    [form, nodeId, lang, setForm],
  );

  return (
    <RichTextField
      handleChange={(val) => setText(val)}
      value={text as string}
      label={'Texte'}
      helperText={'Paragraphe intégré au questionnaire'}
    />
  );
}
