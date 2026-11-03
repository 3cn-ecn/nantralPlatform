import { useEffect, useState } from 'react';

import { Replay as ReplayIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
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
import { useTranslation } from '#shared/i18n/useTranslation';

export default function SignaturePage() {
  const [markdownContent, setMarkdownCode] = useState('Chargement...');
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('ecn');

  const { t } = useTranslation();
  const query = useSignatureInfo({ staleTime: Infinity });

  useEffect(() => {
    if (query.data) {
      setMarkdownCode(formatSignatureInfoToMarkdown(query.data, template));
    }
  }, [query.data, template]);

  const group =
    (template.startsWith('@') &&
      query.data?.clubMemberships.find(
        (m) => m.group.slug === template.slice(1),
      )?.group) ||
    undefined;

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h1" sx={{ mb: 1 }}>
        {t('signature.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t('signature.description')}
      </Typography>
      <SelectTemplate
        template={template}
        setTemplate={setTemplate}
        clubMemberships={query.data?.clubMemberships}
      />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} sx={{ mt: 2 }}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <TextField
            multiline
            value={markdownContent}
            onChange={(e) => setMarkdownCode(e.target.value)}
            label={t('signature.actions.edit.label')}
            fullWidth
            slotProps={{ htmlInput: { sx: { fontFamily: 'monospace' } } }}
            disabled={query.isFetching}
          />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'end' }}>
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
              onClick={() => setExportModalOpen(true)}
            >
              {t('signature.actions.export.label')}
            </Button>
          </Stack>
        </Stack>
        <Box sx={{ width: '100%', overflow: 'auto' }}>
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
      </Stack>
      <ExportMethodModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        markdownContent={markdownContent}
        group={group}
      />
    </Container>
  );
}
