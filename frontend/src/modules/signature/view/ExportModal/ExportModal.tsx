import { useState } from 'react';

import { ResponsiveDialog } from '#shared/components/ResponsiveDialog';

import { ChooseMethodModalContent } from './ChooseMethodModalContent';
import { IncludeSignatureModalContent } from './IncludeSignatureModalContent';

interface ExportMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
}

export function ExportMethodModal({
  isOpen,
  onClose,
  markdownContent,
}: ExportMethodModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [codeToCopy, setCodeToCopy] = useState<string | undefined>();
  const [image, setImage] = useState<string | undefined>();

  const onPreviousStep = () => {
    setStep(1);
  };

  const onNextStep = (image?: string, codeToCopy?: string) => {
    setStep(2);
    setImage(image);
    setCodeToCopy(codeToCopy);
  };

  return (
    <ResponsiveDialog open={isOpen} maxWidth="sm" onClose={onClose}>
      {step === 1 ? (
        <ChooseMethodModalContent
          onClose={onClose}
          onNextStep={onNextStep}
          markdownContent={markdownContent}
        />
      ) : (
        <IncludeSignatureModalContent
          onClose={onClose}
          onBack={onPreviousStep}
          codeToCopy={codeToCopy}
          image={image}
        />
      )}
    </ResponsiveDialog>
  );
}
