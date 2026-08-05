import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';

import { FormProvider } from '#modules/form/state/form.context';
import { FormEditRoot } from '#modules/form/view/shared/FormEditRoot';
import { ImportForm } from '#modules/form/view/shared/ImportForm';
import { SaveForm } from '#modules/form/view/shared/SaveForm';
import { RichTextField, TextField } from '#shared/components/FormFields';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';

export default function EditFormPage() {
  const [headerEdit, setHeaderEdit] = useState(true);
  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const params = useParams();
  const rootId = useMemo(() => crypto.randomUUID(), []);

  return (
    <Container sx={{ my: 2 }}>
      <FormProvider
        initialForm={{
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
        {params['uuid'] && <ImportForm uuid={params['uuid']} />}
        <Card>
          <CardContent>
            {headerEdit ? (
              <TextField label={'Titre'} value={name} handleChange={setname} />
            ) : (
              <Typography variant={'h4'}>{name}</Typography>
            )}
            {headerEdit ? (
              <RichTextField
                value={description}
                handleChange={setDescription}
                label={'Description'}
              />
            ) : (
              <RichTextRenderer content={description} />
            )}
          </CardContent>
          <CardActions>
            <Button onClick={() => setHeaderEdit(!headerEdit)}>
              {headerEdit ? 'Confirmer' : 'Modifier'}
            </Button>
          </CardActions>
        </Card>
        <FormEditRoot />
        <SaveForm name={name} description={description} uuid={params['uuid']} />
      </FormProvider>
    </Container>
  );
}
