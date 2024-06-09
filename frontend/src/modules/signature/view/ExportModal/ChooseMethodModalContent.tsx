import { Typography } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';
import { LargeBigButton } from '#shared/components/LargeBigButton/LargeBigButton';
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
  group?: GroupPreview;
}

export function ChooseMethodModalContent({
  onClose,
  onNextStep,
  markdownContent,
  group,
}: ChooseMethodModalContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <ResponsiveDialogHeader onClose={onClose}>
        {t('signature.exportModal.title')}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ gap: 2, pb: 3 }}>
        <Typography>{t('signature.exportModal.recommendedMethod')}</Typography>
        <LargeBigButton
          onClick={() => {
            copyHtmlSourceCode(markdownContent, group).then((code) => {
              onNextStep('/static/img/signature-tutorial.gif', code);
            });
          }}
          color="primary"
          sx={{ px: 1, py: 2 }}
        >
          <Typography>
            {t('signature.exportModal.copyHtmlSourceCode')}
          </Typography>
        </LargeBigButton>
        <Typography>{t('signature.exportModal.otherMethods')}</Typography>
        <LargeBigButton
          onClick={() => {
            copyAsHtml(markdownContent, group).then(() => {
              onNextStep();
            });
          }}
          color="secondary"
          sx={{ px: 1, py: 2 }}
        >
          <Typography>{t('signature.exportModal.copyAsHtml')}</Typography>
        </LargeBigButton>
        <LargeBigButton
          onClick={() => {
            copyAsPlainText(markdownContent).then((code) => {
              onNextStep(undefined, code);
            });
          }}
          color="secondary"
          sx={{ px: 1, py: 2 }}
        >
          <Typography>{t('signature.exportModal.copyAsRawText')}</Typography>
        </LargeBigButton>
      </ResponsiveDialogContent>
    </>
  );
}
