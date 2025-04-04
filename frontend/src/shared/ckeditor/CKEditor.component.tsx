import { forwardRef } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { EventInfo } from '@ckeditor/ckeditor5-utils';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import 'ckeditor5/ckeditor5.css';

import { useTranslation } from '#shared/i18n/useTranslation';

import { CustomEditor } from './CustomEditor';
import './custom.styles.scss';
import { getCKEditorLanguage } from './getCKEditorLanguage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CKEditorWithRef = forwardRef<HTMLInputElement>((props: any, ref) => {
  return (
    <>
      <CKEditor {...props} />
      <input hidden ref={ref} />
    </>
  );
});
CKEditorWithRef.displayName = 'CKEditorWithRef';

interface CKEditorComponentProps {
  value: string;
  handleChange: (val: string) => void;
  name?: string;
  label: string;
  errors?: string[];
  helperText?: string;
  placeholder?: string;
}

export default function CKEditorComponent({
  value,
  handleChange,
  name,
  label,
  errors,
  helperText,
  placeholder,
}: CKEditorComponentProps) {
  const { i18n } = useTranslation();

  const isError = errors !== undefined;

  return (
    <FormControl margin="normal" variant="outlined" fullWidth>
      <InputLabel
        htmlFor="richtext-input"
        error={isError}
        style={{ transform: 'translate(14px, -18px) scale(0.75)' }}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        id="richtext-input"
        value={value}
        slots={{ input: CKEditorWithRef }}
        error={isError}
        slotProps={{
          input: {
            name: name,
            editor: CustomEditor,
            data: value,
            config: { language: getCKEditorLanguage(i18n), placeholder },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
        onChange={
          ((event: EventInfo, editor: CustomEditor) => {
            const data = editor.getData();
            handleChange(data);

            // Force type because Mui does not support CKEditor onChange type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        }
      />
      <FormHelperText error={isError}>
        {isError ? errors.join(', ') : helperText}
      </FormHelperText>
    </FormControl>
  );
}
