import { useState } from 'react';

import { UISchemaElement } from '@jsonforms/core';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';

import { SelectBaseComponent } from '#modules/form/components/SelectBaseComponent';
import { JsonFormProvider } from '#modules/form/state/JsonFormContext';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { RichTextField, TextField } from '#shared/components/FormFields';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';

const INITIAL_FORM_STATE: JsonFormSchema = {
  uuid: 'none',
  name: '',
  description: '',
  i18nKeys: { fr: {}, en: {} },
  schema: { type: 'object', properties: {} },
  uiSchema: { type: 'VerticalLayout', elements: [] } as UISchemaElement,
};

export default function EditFormPage() {
  const [headerEdit, setHeaderEdit] = useState(true);
  const [jsonForm, setJsonForm] = useState<JsonFormSchema>(INITIAL_FORM_STATE);

  const handleNameChange = (value: string) => {
    setJsonForm({ ...jsonForm, name: value });
  };

  const handleDescriptionChange = (value: string) => {
    setJsonForm({ ...jsonForm, description: value });
  };

  const toggleHeaderEdit = () => {
    setHeaderEdit(!headerEdit);
  };

  return (
    <JsonFormProvider>
      <Container sx={{ my: 2 }}>
        <Card>
          <CardContent>
            {headerEdit ? (
              <TextField
                label={'Titre'}
                value={jsonForm.name}
                handleChange={handleNameChange}
              />
            ) : (
              <Typography variant={'h4'}>{jsonForm.name}</Typography>
            )}
            {headerEdit ? (
              <RichTextField
                value={jsonForm.description}
                handleChange={handleDescriptionChange}
                label={'Description'}
              />
            ) : (
              <RichTextRenderer content={jsonForm.description} />
            )}
          </CardContent>
          <CardActions>
            <Button onClick={toggleHeaderEdit}>
              {headerEdit ? 'Confirmer' : 'Modifier'}
            </Button>
          </CardActions>
        </Card>
        <SelectBaseComponent />
      </Container>
    </JsonFormProvider>
  );
}
