import { useState } from 'react';

import { Button, Container, TextField, Typography } from '@mui/material';
import { render } from '@react-email/render';

import { useSignatureInfo } from '#modules/signature/hooks/useSignature.query';
import { SignatureTemplate } from '#modules/signature/view/SignatureTemplate';
import { formatSignatureInfoToMarkdown } from '#modules/signature/view/formatSignatureInfoToMarkdown';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
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
      <Typography variant="h1">{t('signature.title')}</Typography>
      <Spacer vertical={5} />
      <FlexAuto gap={4}>
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
            >
              {t('signature.actions.reset.label')}
            </Button>
            <Button variant="contained">
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
