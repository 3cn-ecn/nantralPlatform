import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Button, Container, TextField, Typography } from '@mui/material';
import { render } from '@react-email/render';
import { useState } from 'react';
import { SignatureTemplate } from './components/SignatureTemplate';

const defaultSignature = `# Jean-Baptiste AVRILIER
*Élève-Ingénieur⋅e en Xe année*
Option Cassage de Bâtiment C
----
Directeur d'École
Gardien de crèche
----
T : +33 2 40 37 16 00
**jean-baptiste.avrilier@eleves.ec-nantes.fr**`;

export default function SignaturePage() {
  const [markdownContent, setMarkdownCode] = useState(defaultSignature);
  const { t } = useTranslation();

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
            inputProps={{
              sx: { fontFamily: 'monospace' },
            }}
          />
          <FlexRow gap={1} justifyContent="end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setMarkdownCode(defaultSignature)}
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
