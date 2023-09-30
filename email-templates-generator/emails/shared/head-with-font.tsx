import { Font, Head } from '@react-email/components';

const HeadWithFont = () => (
  <Head>
    <Font
      fontFamily="Heebo"
      fallbackFontFamily="Helvetica"
      webFont={{
        url: 'https://fonts.googleapis.com/css2?family=Heebo',
        format: 'woff2',
      }}
      fontWeight={400}
      fontStyle="normal"
    />
  </Head>
);

export default HeadWithFont;
