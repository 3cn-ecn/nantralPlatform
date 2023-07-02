import { memo } from 'react';

import { MuiFileInput, MuiFileInputProps } from 'mui-file-input';

import { useTranslation } from '#shared/i18n/useTranslation';

type FileFieldProps<Multiple extends boolean> = Omit<
  MuiFileInputProps<Multiple>,
  'error' | 'fullWidth'
> & {
  errors?: string[];
  prevFileName?: string;
  accept?: string;
};

function FileFieldComponent<Multiple extends boolean = false>({
  value,
  errors,
  helperText,
  prevFileName,
  accept,
  ...props
}: FileFieldProps<Multiple>) {
  const { t } = useTranslation();
  const isError = errors !== undefined;

  return (
    <MuiFileInput
      value={value}
      error={isError}
      helperText={isError ? errors.join(', ') : helperText}
      margin="normal"
      placeholder={
        prevFileName
          ? prevFileName.split('/').at(-1)
          : t('form.file.placeholder')
      }
      inputProps={{ accept: accept }}
      {...props}
    />
  );
}

export const FileField = memo(FileFieldComponent) as typeof FileFieldComponent;
