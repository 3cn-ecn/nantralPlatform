import { useMemo } from 'react';

import { ShowForm } from '#modules/form/components/ShowForm';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import { exportTree } from '#modules/form/state/JsonFormReducer';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function FormPreview() {
  const { jsonForm } = useJsonForm();
  const jsonFormSchema = useMemo(() => exportTree(jsonForm), [jsonForm]);
  return (
    <FlexCol gap={2}>
      {jsonForm && (
        <ShowForm
          jsonFormSchema={{
            ...jsonFormSchema,
            uuid: crypto.randomUUID(),
            name: 'Form Preview',
            description: 'Prévisualisation du formulaire',
          }}
        />
      )}
      {JSON.stringify(jsonFormSchema)}
    </FlexCol>
  );
}
