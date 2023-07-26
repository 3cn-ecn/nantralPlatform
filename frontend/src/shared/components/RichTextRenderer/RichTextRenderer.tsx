import { Typography } from '@mui/material';

/**
 * For the moment, styles are imported from the <CKEditor /> component, in
 * the RichTextField component. However it can breaks in the future if this
 * component is no more exported in the same build as this one.
 * In this case, we will need to import a custom style sheet here; see
 * https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/content-styles.html
 * for more details.
 **/

type RichTextRendererProps = { content: string };

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <Typography
      // default classes included in the CKEditor component
      className="ckeditor ck-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
