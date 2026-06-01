import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';

import { ImportForm } from '#modules/form/components/ImportForm';
import { SaveForm } from '#modules/form/components/SaveForm';
import { SelectBaseComponent } from '#modules/form/components/SelectBaseComponent';
import { JsonFormProvider } from '#modules/form/state/JsonFormContext';
import { RichTextField, TextField } from '#shared/components/FormFields';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';

export default function EditFormPage() {
  const [headerEdit, setHeaderEdit] = useState(true);
  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const params = useParams();

  return (
    <JsonFormProvider>
      {params['uuid'] && <ImportForm uuid={params['uuid']} />}
      <Container sx={{ my: 2 }}>
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
        <SelectBaseComponent />
      </Container>
      <SaveForm name={name} description={description} uuid={params['uuid']} />
    </JsonFormProvider>
  );
}
