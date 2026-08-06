import { useCallback, useState } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { RichTextField, TextField } from '#shared/components/FormFields';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';

export function FormHeaderFields() {
  const { form, setForm } = useFormContext();
  const [headerEdit, setHeaderEdit] = useState(true);
  const setName = useCallback(
    (val) => setForm({ ...form, name: val }),
    [form, setForm],
  );
  const setDescription = useCallback(
    (val) => setForm({ ...form, description: val }),
    [form, setForm],
  );
  return (
    <Card>
      <CardContent>
        {headerEdit ? (
          <TextField label={'Titre'} value={form.name} handleChange={setName} />
        ) : (
          <Typography variant={'h4'}>{form.name}</Typography>
        )}
        {headerEdit ? (
          <RichTextField
            value={form.description}
            handleChange={setDescription}
            label={'Description'}
          />
        ) : (
          <RichTextRenderer content={form.description} />
        )}
      </CardContent>
      <CardActions>
        <Button onClick={() => setHeaderEdit(!headerEdit)}>
          {headerEdit ? 'Confirmer' : 'Modifier'}
        </Button>
      </CardActions>
    </Card>
  );
}
