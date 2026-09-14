import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { JsonSchema } from '@jsonforms/core';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { Box, CircularProgress, Fab } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { omit, unset } from 'lodash';

import { createJsonSchemaApi } from '#modules/form/api/createJsonSchema.api';
import { updateJsonSchemaApi } from '#modules/form/api/updateJsonSchema.api';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import {
  collectTranslationIssues,
  nodeToJsonForm,
} from '#modules/form/state/utils';
import { Node } from '#modules/form/types/form.type';
import { JsonFormSchemaForm } from '#modules/form/types/jsonForm.type';
import { baseLanguages } from '#shared/i18n/config';

import TranslationIssuesModal from './TranslationIssuesModal';

const getAllowedTranslationKeys = (node: Node): Set<string> => {
  const allowed = new Set<string>();
  const type = node.payload.type;

  if (type === 'Control') {
    allowed.add('label');
    allowed.add('description');
  } else if (type === 'Label') {
    allowed.add('text');
  } else if (type === 'Group' || type === 'Category') {
    allowed.add('label');
  } else {
    allowed.add('label');
    allowed.add('description');
    allowed.add('text');
  }

  const schema = node.payload.schema ?? {};
  const enumOptions = (schema.enum ??
    (schema.items as JsonSchema | undefined)?.enum ??
    []) as string[];
  enumOptions.forEach((option) => allowed.add(option));

  Object.keys(schema.allOf?.[0]?.properties ?? {}).forEach((rowId) =>
    allowed.add(rowId),
  );

  const weightedListOptions = (
    schema.allOf?.[1]?.patternProperties?.['^.*$']?.properties?.value?.oneOf ??
    []
  )
    .map((entry) => entry.title)
    .filter(Boolean) as string[];
  weightedListOptions.forEach((option) => allowed.add(option));

  return allowed;
};

export function SaveForm() {
  const { form, setPayload } = useFormContext();
  const jsonFormSchema = useMemo(() => nodeToJsonForm(form), [form]);
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

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

  const cleanupOrphans = useCallback(() => {
    Object.entries(form.nodes).forEach(([nodeId, node]: [UUID, Node]) => {
      baseLanguages.forEach((lang) => {
        const currentTranslations = node.payload.translation?.[lang] ?? {};
        const allowedKeys = getAllowedTranslationKeys(node);
        const keysToRemove = Object.keys(currentTranslations).filter(
          (key) => !allowedKeys.has(key),
        );

        if (keysToRemove.length === 0) {
          return;
        }

        const nextPayload = { ...node.payload };
        nextPayload.translation = { ...(nextPayload.translation ?? {}) };
        nextPayload.translation[lang] = {
          ...(nextPayload.translation[lang] ?? {}),
        };

        keysToRemove.forEach((key) => {
          unset(nextPayload, ['translation', lang, key]);
        });

        setPayload(nodeId, nextPayload);
      });
    });
  }, [form.nodes, setPayload]);

  const handleSaveClick = useCallback(() => {
    cleanupOrphans();

    const issues = collectTranslationIssues(form);
    const hasMissing = Object.keys(issues.missing).length > 0;
    const hasWarnings = Object.keys(issues.warnings).length > 0;

    if (hasMissing || hasWarnings) {
      setShowModal(true);
      return;
    }

    mutate(omit(jsonFormSchema, 'uuid'));
  }, [cleanupOrphans, form, jsonFormSchema, mutate]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleModalResolved = useCallback(() => {
    setShowModal(false);
    cleanupOrphans();

    const freshJson = nodeToJsonForm(form);
    mutate(omit(freshJson, 'uuid'));
  }, [cleanupOrphans, form, mutate]);

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
      <Fab
        aria-label="save"
        color={isSuccess ? 'success' : 'primary'}
        onClick={handleSaveClick}
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
      {showModal && (
        <TranslationIssuesModal
          onClose={handleModalClose}
          onResolved={handleModalResolved}
        />
      )}
    </Box>
  );
}
