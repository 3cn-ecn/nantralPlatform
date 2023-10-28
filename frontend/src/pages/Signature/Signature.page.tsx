import { useState } from 'react';

import { Replay as ReplayIcon, Send as SendIcon } from '@mui/icons-material';
import { Button, Container, TextField, Typography } from '@mui/material';
import { render } from '@react-email/render';

import { useSignatureInfo } from '#modules/signature/hooks/useSignature.query';
import { SignatureTemplate } from '#modules/signature/view/SignatureTemplate';
import { formatSignatureInfoToMarkdown } from '#modules/signature/view/formatSignatureInfoToMarkdown';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function SignaturePage() {
  const [markdownContent, setMarkdownCode] = useState('Chargement...');
  const { t } = useTranslation();
  const query = useSignatureInfo({
    onSuccess(data) {
      setMarkdownCode(formatSignatureInfoToMarkdown(data));
    },
  });

  const htmlCode = render(
    <SignatureTemplate markdownContent={markdownContent} />,
  );

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h1" mb={1}>
        {t('signature.title')}
      </Typography>
      <Typography variant="body1" mb={4}>
        {t('signature.description')}
      </Typography>
      <FlexAuto gap={6}>
        <FlexCol width="100%" gap={2}>
          <TextField
            multiline
            value={markdownContent}
            onChange={(e) => setMarkdownCode(e.target.value)}
            label="Source"
            fullWidth
            inputProps={{ sx: { fontFamily: 'monospace' } }}
            disabled={query.isLoading}
          />
          <FlexRow gap={1} justifyContent="end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                query.isSuccess &&
                setMarkdownCode(formatSignatureInfoToMarkdown(query.data))
              }
              endIcon={<ReplayIcon />}
            >
              {t('signature.actions.reset.label')}
            </Button>
            <Button variant="contained" endIcon={<SendIcon />}>
              {t('signature.actions.export.label')}
            </Button>
          </FlexRow>
        </FlexCol>
        <div
          dangerouslySetInnerHTML={{ __html: htmlCode }}
          style={{ width: '100%' }}
        />
      </FlexAuto>
    </Container>
  );
}
