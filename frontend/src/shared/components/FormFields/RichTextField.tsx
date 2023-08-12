import { Suspense, lazy } from 'react';

import { noop } from 'lodash-es';

import { useTranslation } from '#shared/i18n/useTranslation';

import { RichTextFieldInternalProps } from './RichTextField.internal';
import { TextField } from './TextField';

const RichTextFieldInternal = lazy(() => import('./RichTextField.internal'));

type RichTextFieldProps = RichTextFieldInternalProps;

export function RichTextField(props: RichTextFieldProps) {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <TextField
          label={props.label}
          value={t('loading')}
          handleChange={noop}
          helperText={props.helperText}
          disabled
        />
      }
    >
      <RichTextFieldInternal {...props} />
    </Suspense>
  );
}
