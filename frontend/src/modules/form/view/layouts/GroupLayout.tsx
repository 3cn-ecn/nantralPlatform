import { PropsWithChildren, useCallback, useMemo } from 'react';

import { Card, CardActions, CardContent, Stack, useTheme } from '@mui/material';
import { UUID } from 'crypto';
import { set } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';
import { TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

export function GroupLayout({
  children,
  nodeId,
  canAccept,
}: {
  nodeId: UUID;
  canAccept?: boolean;
} & PropsWithChildren) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { form, setForm, lang } = useFormContext();
  const node = useMemo(() => form.nodes[nodeId], [form.nodes, nodeId]);

  const label = useMemo(
    () => node.payload.translation[lang].label,
    [node.payload.translation, lang],
  );

  const setLabel = useCallback(
    (val: string) => {
      set(form, `nodes.${nodeId}.payload.translation.${lang}.label`, val);
      setForm(form);
    },
    [form, nodeId, lang, setForm],
  );

  return (
    <Card variant={'elevation'}>
      <CardContent>
        <TextField
          handleChange={(val) => setLabel(val)}
          value={label}
          label={t('jsonForm.edit.group.label')}
          helperText={t('jsonForm.edit.group.labelHelp')}
        />
        <Stack
          gap={2}
          border={'1px solid'}
          borderColor={canAccept ? undefined : 'transparent'}
          borderRadius={`${theme.shape.borderRadius}px`}
        >
          {children}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <AddChildButton nodeId={nodeId} />
      </CardActions>
    </Card>
  );
}
