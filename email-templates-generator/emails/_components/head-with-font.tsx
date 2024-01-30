import { Font, Head } from '@react-email/components';

const heeboFontFileUrl =
  'https://fonts.gstatic.com/s/heebo/v22/NGS6v5_NC0k9P9H2TbFhsqMA.woff2';

const HeadWithFont = () => (
  <Head>
    <Font
      fontFamily="Heebo"
      fallbackFontFamily={['Helvetica', 'sans-serif' as 'Arial']}
      webFont={{ url: heeboFontFileUrl, format: 'woff2' }}
      fontWeight={400}
      fontStyle="normal"
    />
    <Font
      fontFamily="Heebo"
      fallbackFontFamily={['Helvetica', 'sans-serif' as 'Arial']}
      webFont={{ url: heeboFontFileUrl, format: 'woff2' }}
      fontWeight={800}
      fontStyle="normal"
    />
  </Head>
);

export default HeadWithFont;
