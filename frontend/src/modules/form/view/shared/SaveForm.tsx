import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { Box, CircularProgress, Fab } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { omit } from 'lodash';

import { createJsonSchemaApi } from '#modules/form/api/createJsonSchema.api';
import { updateJsonSchemaApi } from '#modules/form/api/updateJsonSchema.api';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { nodeToJsonForm } from '#modules/form/state/utils';
import { JsonFormSchemaForm } from '#modules/form/types/jsonForm.type';

export function SaveForm() {
  const { form } = useFormContext();
  const jsonFormSchema = useMemo(() => nodeToJsonForm(form), [form]);
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn:
      // Check path to determine if we need to update or create
      'uuid' in params
        ? (schema: Omit<JsonFormSchemaForm, 'uuid'>) =>
            updateJsonSchemaApi(form.uuid, schema)
        : createJsonSchemaApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });

      // continue editing after creating form, or refresh if form existed
      if (!('uuid' in params)) navigate(`/form/${data.uuid}/edit/`);
      else queryClient.invalidateQueries({ queryKey: ['form', params.uuid] });
    },
  });

  // Reset the mutation when a field is changed
  useEffect(reset, [form, reset]);

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
      <Fab
        aria-label="save"
        color={isSuccess ? 'success' : 'primary'}
        onClick={() => mutate(omit(jsonFormSchema, 'uuid'))}
      >
        {isSuccess ? <CheckIcon /> : <SaveIcon />}
      </Fab>
      {isPending && (
        <CircularProgress
          aria-label="Loading…"
          size={68}
          color={'success'}
          sx={{
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}
