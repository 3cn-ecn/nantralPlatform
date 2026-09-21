import { useCallback, useEffect, useRef, useState } from 'react';

import TranslateIcon from '@mui/icons-material/Translate';
import { Avatar, Button, Grid, Typography, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { INPUT_TYPES, LAYOUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { collectTranslationIssues } from '#modules/form/state/utils';
import { Node } from '#modules/form/types/form.type';
import { RichTextField, TextField } from '#shared/components/FormFields';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { baseLanguages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';

interface Props {
  onClose: () => void;
  onResolved: () => void;
}

type IssueMap = Record<string, Record<string, string[]>>;

const getNodeHeaderKey = (node: Node) => {
  if (node.payload.type === 'Control') {
    const inputType = node.payload.schema?.['x-type'] as string | undefined;
    return INPUT_TYPES[inputType ?? '']?.i18nKey ?? 'jsonForm.edit.control';
  }

  return LAYOUT_TYPES[node.payload.type]?.i18nKey ?? node.payload.type;
};

const getWeightedListMetadata = (node: Node) => {
  const schema = node.payload.schema ?? {};
  const rows = Object.keys(schema.allOf?.[0]?.properties ?? {});
  const columns = (
    schema.allOf?.[1]?.patternProperties?.['^.*$']?.properties?.value?.oneOf ??
    []
  )
    .map((entry) => entry.title)
    .filter(Boolean) as string[];

  return { rows, columns };
};

const getOptionMetadata = (node: Node) => {
  const schema = node.payload.schema ?? {};
  const schemaType = schema['x-type'] as string | undefined;

  if (schemaType === 'weightedList') {
    return { ...getWeightedListMetadata(node), options: [] };
  }

  if (schemaType === 'Enum') {
    return { rows: [], columns: [], options: (schema.enum ?? []) as string[] };
  }

  if (schemaType === 'Multiple choice') {
    return {
      rows: [],
      columns: [],
      options: ((schema.items as { enum?: string[] } | undefined)?.enum ??
        []) as string[],
    };
  }

  return { rows: [], columns: [], options: [] };
};

export default function TranslationIssuesModal({ onClose, onResolved }: Props) {
  const { form, setPayload } = useFormContext();
  const { t } = useTranslation();
  const { palette } = useTheme();

  const [issues, setIssues] = useState<{
    missing: IssueMap;
    warnings: IssueMap;
  }>({
    missing: {},
    warnings: {},
  });
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      const initialIssues = collectTranslationIssues(form);
      setIssues(initialIssues);

      const nodeIds = Array.from(
        new Set([
          ...Object.keys(initialIssues.missing),
          ...Object.keys(initialIssues.warnings),
        ]),
      );
      setVisibleNodeIds(nodeIds);
      initializedRef.current = true;
    }
  }, [form]);

  const handleSetTranslation = useCallback(
    (
      nodeId: string,
      lang: string,
      key: string,
      value: string | Record<string, string>,
    ) => {
      const node = form.nodes[nodeId];
      if (!node) {
        return;
      }

      const nextPayload = { ...node.payload };
      nextPayload.translation = { ...(nextPayload.translation ?? {}) };
      nextPayload.translation[lang] = {
        ...(nextPayload.translation[lang] ?? {}),
        [key]: value,
      };

      setPayload(nodeId as UUID, nextPayload);
    },
    [form, setPayload],
  );

  const handleRecheck = useCallback(() => {
    const refreshedIssues = collectTranslationIssues(form);
    setIssues(refreshedIssues);

    setVisibleNodeIds((previous) =>
      Array.from(
        new Set([
          ...previous,
          ...Object.keys(refreshedIssues.missing),
          ...Object.keys(refreshedIssues.warnings),
        ]),
      ),
    );

    if (Object.keys(refreshedIssues.missing).length === 0) {
      onResolved();
    }
  }, [form, onResolved]);

  return (
    <ResponsiveDialog onClose={onClose} fullWidth maxWidth={'lg'}>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <TranslateIcon />
          </Avatar>
        }
      >
        {t('jsonForm.edit.translationModal.title')}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        {visibleNodeIds.length === 0 ? (
          <Typography>{t('jsonForm.edit.translationModal.noIssue')}</Typography>
        ) : (
          visibleNodeIds.map((nodeId) => {
            const node = form.nodes[nodeId];
            if (!node) {
              return null;
            }

            const nodeMissing = issues.missing[nodeId] ?? {};
            const nodeWarnings = issues.warnings[nodeId] ?? {};
            const headerKey = getNodeHeaderKey(node);
            const { rows, columns, options } = getOptionMetadata(node);

            return (
              <Grid container spacing={2} key={nodeId} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant={'subtitle2'}>{t(headerKey)}</Typography>
                </Grid>

                {baseLanguages.map((lang) => (
                  <Grid
                    size={{ xs: 12, md: Math.floor(12 / baseLanguages.length) }}
                    key={lang}
                  >
                    <Typography variant={'caption'}>{lang}</Typography>

                    {node.payload.type === 'Label' ? (
                      <RichTextField
                        handleChange={(value) =>
                          handleSetTranslation(
                            nodeId as unknown as UUID,
                            lang,
                            'text',
                            value,
                          )
                        }
                        value={
                          (node.payload.translation?.[lang]?.text as
                            string | undefined) ?? ''
                        }
                        label={t('jsonForm.edit.translationModal.text', {
                          lang,
                        })}
                      />
                    ) : (
                      <>
                        <TextField
                          label={t('jsonForm.edit.translationModal.label', {
                            lang,
                          })}
                          fullWidth
                          size={'small'}
                          margin={'dense'}
                          value={node.payload.translation?.[lang]?.label ?? ''}
                          handleChange={(value) =>
                            handleSetTranslation(
                              nodeId as unknown as UUID,
                              lang,
                              'label',
                              value,
                            )
                          }
                          errors={
                            nodeMissing?.[lang]?.includes('label')
                              ? [t('jsonForm.edit.translationModal.required')]
                              : undefined
                          }
                          helperText=" "
                        />

                        {node.payload.type === 'Control' && (
                          <TextField
                            label={t(
                              'jsonForm.edit.translationModal.description',
                              {
                                lang,
                              },
                            )}
                            fullWidth
                            size={'small'}
                            margin={'dense'}
                            value={
                              node.payload.translation?.[lang]?.description ??
                              ''
                            }
                            handleChange={(value) =>
                              handleSetTranslation(
                                nodeId as unknown as UUID,
                                lang,
                                'description',
                                value,
                              )
                            }
                            helperText={
                              nodeWarnings?.[lang]?.includes('description')
                                ? t('jsonForm.edit.translationModal.optional')
                                : ' '
                            }
                          />
                        )}
                      </>
                    )}

                    {rows.length > 0 &&
                      rows.map((rowId, i) => (
                        <TextField
                          key={rowId}
                          label={t('jsonForm.edit.translationModal.row', {
                            lang,
                            i: i + 1,
                          })}
                          fullWidth
                          size={'small'}
                          margin={'dense'}
                          value={
                            (
                              node.payload.translation?.[lang]?.[rowId] as {
                                label?: string;
                              }
                            )?.label ?? ''
                          }
                          handleChange={(value) =>
                            handleSetTranslation(nodeId as UUID, lang, rowId, {
                              label: value,
                            })
                          }
                          errors={
                            nodeMissing?.[lang]?.includes(`row:${rowId}`)
                              ? [t('jsonForm.edit.translationModal.required')]
                              : undefined
                          }
                          helperText=" "
                        />
                      ))}

                    {columns.length > 0 &&
                      columns.map((columnId, i) => (
                        <TextField
                          key={columnId}
                          label={t('jsonForm.edit.translationModal.column', {
                            lang,
                            i: i + 1,
                          })}
                          fullWidth
                          size={'small'}
                          margin={'dense'}
                          value={
                            (
                              node.payload.translation?.[lang]?.[columnId] as {
                                label?: string;
                              }
                            )?.label ?? ''
                          }
                          handleChange={(value) =>
                            handleSetTranslation(
                              nodeId as UUID,
                              lang,
                              columnId,
                              {
                                label: value,
                              },
                            )
                          }
                          errors={
                            nodeMissing?.[lang]?.includes(`column:${columnId}`)
                              ? [t('jsonForm.edit.translationModal.required')]
                              : undefined
                          }
                          helperText=" "
                        />
                      ))}

                    {options.length > 0 &&
                      options.map((optionId, i) => (
                        <TextField
                          key={optionId}
                          label={t('jsonForm.edit.translationModal.option', {
                            lang,
                            i: i + 1,
                          })}
                          fullWidth
                          size={'small'}
                          margin={'dense'}
                          value={
                            node.payload.translation?.[lang]?.[optionId] ?? ''
                          }
                          handleChange={(value) =>
                            handleSetTranslation(
                              nodeId as unknown as UUID,
                              lang,
                              optionId,
                              value,
                            )
                          }
                          errors={
                            nodeMissing?.[lang]?.includes(`option:${optionId}`)
                              ? [t('jsonForm.edit.translationModal.required')]
                              : undefined
                          }
                          helperText=" "
                        />
                      ))}
                  </Grid>
                ))}
              </Grid>
            );
          })
        )}
      </ResponsiveDialogContent>

      <ResponsiveDialogFooter>
        <Button onClick={onClose}>{t('button.cancel')}</Button>
        <Button variant={'contained'} onClick={handleRecheck} color={'primary'}>
          {t('jsonForm.edit.translationModal.confirm')}
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
