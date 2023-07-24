import { memo } from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';

import './RichTextField.scss';

type RichTextFieldProps = {
  value: string;
  handleChange: (val: string) => void;
  name?: string;
  label: string;
  errors?: string[];
  helperText?: string;
};

function RichTextFieldComponent({
  value,
  handleChange,
  name,
  label,
  errors,
  helperText,
}: RichTextFieldProps) {
  const isError = errors !== undefined;

  return (
    <FormControl sx={{ my: 1 }}>
      <FormLabel error={isError}>{label}</FormLabel>
      <CKEditor
        name={name}
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          handleChange(data);
        }}
      />
      <FormHelperText sx={{ m: 0 }}>
        {isError ? errors.join(', ') : helperText}
      </FormHelperText>
    </FormControl>
  );
}

export const RichTextField = memo(RichTextFieldComponent);
