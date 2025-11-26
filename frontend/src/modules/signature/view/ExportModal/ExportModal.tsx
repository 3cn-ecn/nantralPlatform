import { useState } from 'react';

import { GroupPreview } from '#modules/group/types/group.types';
import { ResponsiveDialog } from '#shared/components/ResponsiveDialog';

import { ChooseMethodModalContent } from './ChooseMethodModalContent';
import { IncludeSignatureModalContent } from './IncludeSignatureModalContent';

interface ExportMethodModalProps {
  step: 0 | 1 | 2;
  setStep: (step: 0 | 1 | 2) => void;
  markdownContent: string;
  group?: GroupPreview;
}

export function ExportMethodModal({
  step,
  setStep,
  markdownContent,
  group,
}: ExportMethodModalProps) {
  const [codeToCopy, setCodeToCopy] = useState<string | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const isOpen = Boolean(step);

  const onPreviousStep = () => {
    setStep(1);
  };

  const onNextStep = (image?: string, codeToCopy?: string) => {
    setStep(2);
    setImage(image);
    setCodeToCopy(codeToCopy);
  };

  return (
    <ResponsiveDialog open={isOpen} maxWidth="sm" onClose={() => setStep(0)}>
      {step === 1 ? (
        <ChooseMethodModalContent
          onClose={() => setStep(0)}
          onNextStep={onNextStep}
          markdownContent={markdownContent}
          group={group}
        />
      ) : (
        <IncludeSignatureModalContent
          onClose={() => setStep(0)}
          onBack={onPreviousStep}
          codeToCopy={codeToCopy}
          image={image}
        />
      )}
    </ResponsiveDialog>
  );
}
