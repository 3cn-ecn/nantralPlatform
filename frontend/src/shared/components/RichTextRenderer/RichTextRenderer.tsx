import { Typography } from '@mui/material';
import 'ckeditor5/ckeditor5.css';

import '#shared/ckeditor/custom.styles.scss';

interface RichTextRendererProps {
  content: string;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <Typography
      // default classes included in the CKEditor component
      className="ckeditor ck-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
