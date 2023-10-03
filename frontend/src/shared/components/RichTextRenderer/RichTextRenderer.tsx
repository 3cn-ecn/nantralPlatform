import { Typography } from '@mui/material';

import '#shared/ckeditor/styles/base.styles.scss';

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
