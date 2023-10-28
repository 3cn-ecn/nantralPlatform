import { ArrowForward } from '@mui/icons-material';
import { Card, CardActionArea, Typography, useTheme } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';

import { copyAsHtml } from './copyAsHtml';
import { copyAsPlainText } from './copyAsPlainText';
import { copyHtmlSourceCode } from './copyHtmlSourceCode';

interface ChooseMethodModalContentProps {
  onClose: () => void;
  onNextStep: (image?: string, codeToCopy?: string) => void;
  markdownContent: string;
}

export function ChooseMethodModalContent({
  onClose,
  onNextStep,
  markdownContent,
}: ChooseMethodModalContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <ResponsiveDialogHeader onClose={onClose}>
        {t('signature.exportModal.title')}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ gap: 2, pb: 3 }}>
        <Typography variant="body1">
          {t('signature.exportModal.recommendedMethod')}
        </Typography>
        <LargeBigButton
          title={t('signature.exportModal.copyHtmlSourceCode')}
          onClick={() => {
            copyHtmlSourceCode(markdownContent).then((code) => {
              onNextStep('/static/img/signature-tutorial.gif', code);
            });
          }}
          color="primary"
        />
        <Typography variant="body1">
          {t('signature.exportModal.otherMethods')}
        </Typography>
        <LargeBigButton
          title={t('signature.exportModal.copyAsHtml')}
          onClick={() => {
            copyAsHtml(markdownContent).then(() => {
              onNextStep();
            });
          }}
          color="secondary"
        />
        <LargeBigButton
          title={t('signature.exportModal.copyAsrawText')}
          onClick={() => {
            copyAsPlainText(markdownContent).then((code) => {
              onNextStep(undefined, code);
            });
          }}
          color="secondary"
        />
      </ResponsiveDialogContent>
    </>
  );
}

interface LargeBigButtonProps {
  title: string;
  onClick: () => void;
  color: 'primary' | 'secondary';
}

function LargeBigButton({ title, onClick, color }: LargeBigButtonProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderColor: theme.palette[color].light,
        color: theme.palette[color].main,
      }}
    >
      <CardActionArea onClick={onClick}>
        <FlexRow
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          px={2}
          py={3}
        >
          <Typography variant="body1">{title}</Typography>
          <ArrowForward />
        </FlexRow>
      </CardActionArea>
    </Card>
  );
}
