import { SxProps, Theme, Typography } from '@mui/material';
import 'ckeditor5/ckeditor5.css';

import '#shared/ckeditor/custom.styles.scss';

interface RichTextRendererProps {
  content: string;
  sx?: SxProps<Theme>;
}

export function RichTextRenderer({
  content,
  sx,
}: Readonly<RichTextRendererProps>) {
  return (
    <Typography
      // default classes included in the CKEditor component
      className="ckeditor ck-content"
      dangerouslySetInnerHTML={{ __html: content }}
      sx={sx}
    />
  );
}
