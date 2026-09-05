import { useState } from 'react';
import { useParams } from 'react-router';

import { Button, Container } from '@mui/material';

import { FormProvider } from '#modules/form/state/form.context';
import { FormEditRoot } from '#modules/form/view/shared/FormEditRoot';
import { FormHeaderFields } from '#modules/form/view/shared/FormHeaderFields';
import { FormPreview } from '#modules/form/view/shared/FormPreview';
import { ImportForm } from '#modules/form/view/shared/ImportForm';
import { SaveForm } from '#modules/form/view/shared/SaveForm';
import { SelectBaseComponent } from '#modules/form/view/shared/SelectBaseComponent';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export default function EditFormPage() {
  const params = useParams();
  const rootId = crypto.randomUUID();
  const [showForm, setShowForm] = useState(false);

  return (
    <Container sx={{ my: 2 }}>
      <FormProvider
        initialForm={{
          uuid: crypto.randomUUID(),
          name: '',
          description: '',
          root: rootId,
          nodes: {
            [rootId]: {
              payload: {
                translation: { en: {}, fr: {} },
                type: 'VerticalLayout',
                options: {},
                schema: {},
              },
              children: [],
            },
          },
        }}
      >
        <FlexCol gap={3}>
          {params['uuid'] && <ImportForm uuid={params['uuid']} />}
          <FormHeaderFields />
          <SelectBaseComponent />
          <FormEditRoot />

          <Button onClick={() => setShowForm(!showForm)}>Show form</Button>
          {showForm && <FormPreview />}
          <SaveForm />
        </FlexCol>
      </FormProvider>
    </Container>
  );
}
