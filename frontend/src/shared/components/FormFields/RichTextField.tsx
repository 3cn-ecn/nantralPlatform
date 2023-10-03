import { Suspense, lazy, memo } from 'react';

import { CircularProgress } from '@mui/material';
import { noop } from 'lodash-es';

import { useTranslation } from '#shared/i18n/useTranslation';

import { TextField } from './TextField';

const CKEditorComponent = lazy(
  () => import('#shared/ckeditor/CKEditor.component'),
);

type RichTextFieldProps = {
  value: string;
  handleChange: (val: string) => void;
  name?: string;
  label: string;
  errors?: string[];
  helperText?: string;
};

function RichTextFieldComponent(props: RichTextFieldProps) {
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
          InputProps={{
            endAdornment: <CircularProgress color="inherit" size={20} />,
          }}
        />
      }
    >
      <CKEditorComponent {...props} />
    </Suspense>
  );
}

export const RichTextField = memo(RichTextFieldComponent);
