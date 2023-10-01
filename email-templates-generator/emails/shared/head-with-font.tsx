import { FontProps, Head } from '@react-email/components';

const heeboFontFileUrl =
  'https://fonts.gstatic.com/s/heebo/v22/NGS6v5_NC0k9P9H2TbFhsqMA.woff2';

const HeadWithFont = () => (
  <Head>
    <Font
      fontFamily="Heebo"
      fallbackFontFamily="Helvetica"
      webFont={{ url: heeboFontFileUrl, format: 'woff2' }}
      fontWeight={400}
      fontStyle="normal"
    />
    <Font
      fontFamily="Heebo"
      fallbackFontFamily="Helvetica"
      webFont={{ url: heeboFontFileUrl, format: 'woff2' }}
      fontWeight={800}
      fontStyle="normal"
    />
  </Head>
);

export default HeadWithFont;

/**
 * Correct the Font component as it is bugged currently
 * See https://github.com/resendlabs/react-email/issues/501
 */
export const Font: React.FC<Readonly<FontProps>> = ({
  fontFamily,
  fallbackFontFamily,
  webFont,
  fontStyle = 'normal',
  fontWeight = 400,
}: FontProps) => {
  const src = webFont
    ? `src: url(${webFont.url}) format(${webFont.format});`
    : '';

  const style = `
    @font-face {
      font-family: ${fontFamily};
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
      mso-font-alt: ${
        Array.isArray(fallbackFontFamily)
          ? fallbackFontFamily[0]
          : fallbackFontFamily
      };
      ${src}
    }

    * {
      font-family: ${fontFamily}, ${
    Array.isArray(fallbackFontFamily)
      ? fallbackFontFamily.join(', ')
      : fallbackFontFamily
  };
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: style }} />;
};

Font.displayName = 'Font';
