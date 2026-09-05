import { ReactNode, useCallback, useMemo } from 'react';

import { StepContent, StepLabel, useTheme } from '@mui/material';
import { UUID } from 'crypto';
import { set } from 'lodash';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';

export function CategoryLayout({
  children,
  nodeId,
  canAccept,
}: {
  nodeId: UUID;
  canAccept?: boolean;
  children: ReactNode;
}) {
  const theme = useTheme();

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
    <FlexCol flexGrow={1}>
      <StepLabel>
        {node.payload.translation[lang]?.label || 'Please insert a label'}
      </StepLabel>
      <StepContent sx={{ border: 0, padding: 0, margin: 0 }}>
        <FlexCol gap={2}>
          <FlexCol gap={2}>
            <TextField
              handleChange={(val) => setLabel(val)}
              value={label}
              label={'Label'}
              helperText={'Nom du groupe de questions'}
            />
            <FlexCol
              gap={2}
              border={'1px solid'}
              borderColor={canAccept ? undefined : 'transparent'}
              borderRadius={`${theme.shape.borderRadius}px`}
            >
              {children}
            </FlexCol>
            <AddChildButton nodeId={nodeId} />
          </FlexCol>
        </FlexCol>
      </StepContent>
    </FlexCol>
  );
}
