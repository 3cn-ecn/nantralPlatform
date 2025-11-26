import { useState } from 'react';

import { Replay as ReplayIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { useSignatureInfo } from '#modules/signature/hooks/useSignature.query';
import { ExportMethodModal } from '#modules/signature/view/ExportModal/ExportModal';
import { SignatureTemplate } from '#modules/signature/view/SignatureTemplate';
import {
  SelectTemplate,
  TemplateType,
} from '#modules/signature/view/templates/SelectTemplate';
import { formatSignatureInfoToMarkdown } from '#modules/signature/view/templates/formatSignatureInfoToMarkdown';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function SignaturePage() {
  // use 0 to represent a closed modal
  const [exportStep, setExportStep] = useState<0 | 1 | 2>(0);
  const [template, setTemplate] = useState<TemplateType>('ecn');

  const { t } = useTranslation();
  const query = useSignatureInfo({ staleTime: Infinity });

  const [markdownContent, setMarkdownCode] = useState(
    formatSignatureInfoToMarkdown(query.data, template),
  );

  const group =
    (template.startsWith('@') &&
      query.data?.clubMemberships.find(
        (m) => m.group.slug === template.slice(1),
      )?.group) ||
    undefined;

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h1" mb={1}>
        {t('signature.title')}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t('signature.description')}
      </Typography>
      <SelectTemplate
        template={template}
        setTemplate={setTemplate}
        clubMemberships={query.data?.clubMemberships}
      />
      <FlexAuto gap={6} mt={2}>
        <FlexCol width="100%" gap={2}>
          <TextField
            multiline
            value={markdownContent}
            onChange={(e) => setMarkdownCode(e.target.value)}
            label={t('signature.actions.edit.label')}
            fullWidth
            inputProps={{ sx: { fontFamily: 'monospace' } }}
            disabled={query.isFetching}
          />
          <FlexRow gap={1} justifyContent="end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => query.refetch()}
              disabled={query.isFetching}
              endIcon={<ReplayIcon />}
            >
              {t('signature.actions.reset.label')}
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => setExportStep(1)}
            >
              {t('signature.actions.export.label')}
            </Button>
          </FlexRow>
        </FlexCol>
        <Box width="100%" overflow="auto">
          <Card
            sx={{
              p: 3,
              width: 'max-content',
              bgcolor: '#FCFCFC',
              borderRadius: 1,
            }}
          >
            <SignatureTemplate
              markdownContent={markdownContent}
              group={group}
            />
          </Card>
        </Box>
      </FlexAuto>
      <ExportMethodModal
        step={exportStep}
        setStep={setExportStep}
        markdownContent={markdownContent}
        group={group}
      />
    </Container>
  );
}
