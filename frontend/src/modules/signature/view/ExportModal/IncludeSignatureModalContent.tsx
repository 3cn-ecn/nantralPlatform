import { Trans } from 'react-i18next';

import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Alert, IconButton, Link, TextField, Typography } from '@mui/material';

import {
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';

interface IncludeSignatureModalContentProps {
  onClose: () => void;
  onBack: () => void;
  codeToCopy?: string;
  image?: string;
}

export function IncludeSignatureModalContent({
  onClose,
  onBack,
  codeToCopy,
  image,
}: IncludeSignatureModalContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      >
        {t('signature.includeSignature.title')}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ gap: 2, pb: 3 }}>
        <Alert severity="success">
          <Typography variant="body1">
            {t('signature.includeSignature.successMessage')}
          </Typography>
        </Alert>
        <Typography variant="body1">
          <Trans t={t} i18nKey="signature.includeSignature.description">
            You can now paste the signature into your favorite email client, or
            directly on the{' '}
            <Link href="https://webmail.ec-nantes.fr" target="_blank">
              Webmail ECN
            </Link>
            .
          </Trans>
        </Typography>
        {!!image && (
          <img src={image} alt={t('signature.includeSignature.tutorialAlt')} />
        )}
        {!!codeToCopy && (
          <>
            <Typography variant="body1">
              {t('signature.includeSignature.copyCode')}
            </Typography>
            <TextField multiline value={codeToCopy} maxRows={3} />
          </>
        )}
      </ResponsiveDialogContent>
    </>
  );
}
