import { useCallback, useState } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function FormHeaderFields() {
  const { t } = useTranslation();
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
          <TextField
            label={t('jsonForm.edit.titleField')}
            value={form.name}
            handleChange={setName}
          />
        ) : (
          <Typography variant={'h4'}>{form.name}</Typography>
        )}
        {headerEdit ? (
          <TextField
            multiline
            rows={3}
            value={form.description}
            handleChange={setDescription}
            label={t('jsonForm.edit.description')}
            helperText={t('jsonForm.edit.descriptionHelp')}
          />
        ) : (
          <Typography>{form.description}</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={() => setHeaderEdit(!headerEdit)}>
          {headerEdit ? t('button.confirm') : t('button.edit')}
        </Button>
      </CardActions>
    </Card>
  );
}
