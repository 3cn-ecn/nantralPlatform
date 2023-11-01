import { CSSProperties } from 'react';

import { Column } from '@react-email/column';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Markdown } from '@react-email/markdown';
import { Row } from '@react-email/row';

import { GroupPreview } from '#modules/group/types/group.types';

const emailRegex = /\b[\w.!#$%&'*+/=?^_`{|}~-]+@[\w.-]+\b/g;
const phoneRegex = /(\+\s?)?\b\d[\d\s.-]{8,}\d\b/g;

function prettify(content: string) {
  return content
    .replaceAll('\n', '\n\n')
    .replace(emailRegex, (email) => `[${email}](mailto:${email})`)
    .replace(
      phoneRegex,
      (phone) => `[${phone}](tel:${phone.replaceAll(' ', '')})`,
    );
}

interface SignatureTemplateProps {
  markdownContent: string;
  group?: GroupPreview;
}

export function SignatureTemplate({
  markdownContent,
  group,
}: SignatureTemplateProps) {
  const content = prettify(markdownContent);
  const isCustomImage = Boolean(group?.icon);

  const imageLink = group?.icon
    ? new URL(group.icon, location.origin).toString()
    : new URL('/static/img/logo_ecn.png', location.origin).toString();
  const link = group?.url
    ? new URL(group.url, location.origin).toString()
    : 'https://www.ec-nantes.fr';

  const logoWidth = isCustomImage ? 80 : 140;

  return (
    <Row>
      <Column
        valign="top"
        width={logoWidth + 20 + (isCustomImage ? 0 : 7 + 19)}
      >
        <Row>
          <Column width={logoWidth + 20}>
            <Link href={link} rel="noopener noreferer">
              <Img
                src={imageLink} // do not use relative path in emails
                alt="Centrale Nantes"
                width={logoWidth}
                style={{
                  ...fontStyles,
                  marginRight: 20,
                  borderRadius: isCustomImage ? 10 : undefined,
                }}
              />
            </Link>
          </Column>
          {!isCustomImage && (
            <Column valign="middle" width={7 + 19}>
              <div
                style={{
                  width: 7,
                  height: 38,
                  backgroundColor: '#FAB600',
                  marginRight: 19,
                }}
              />
            </Column>
          )}
        </Row>
      </Column>
      <Column valign="top">
        <Markdown
          markdownCustomStyles={{
            p: {
              ...fontStyles,
            },
            h1: {
              ...fontStyles,
              fontSize: 'medium',
              fontWeight: 'bold',
            },
            hr: {
              width: 30,
              height: 5,
              backgroundColor: '#FAB600',
              border: 'none',
              marginLeft: 0,
            },
            link: {
              color: 'inherit',
              textDecoration: 'none',
            },
          }}
        >
          {content}
        </Markdown>
      </Column>
    </Row>
  );
}

const fontStyles: CSSProperties = {
  margin: 0,
  marginBottom: 2,
  color: '#102648',
  fontFamily: "Titillium, 'Titillium Web', Arial, sans-serif",
  fontSize: 'small',
  lineHeight: 'normal',
};
