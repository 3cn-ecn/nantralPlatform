import { useMemo } from 'react';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { nodeToJsonForm } from '#modules/form/state/utils';
import { ShowForm } from '#modules/form/view/shared/ShowForm';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function FormPreview() {
  const { form } = useFormContext();
  const jsonFormSchema = useMemo(() => nodeToJsonForm(form), [form]);
  return (
    <FlexCol gap={2}>
      {form && (
        <ShowForm
          jsonFormSchema={{
            ...jsonFormSchema,
            uuid: crypto.randomUUID(),
            name: 'Form Preview',
            description: 'Prévisualisation du formulaire',
          }}
        />
      )}
    </FlexCol>
  );
}
