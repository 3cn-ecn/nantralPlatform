import { CSSProperties } from 'react';

import { Column } from '@react-email/column';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Markdown } from '@react-email/markdown';
import { Row } from '@react-email/row';

interface SignatureTemplateProps {
  markdownContent: string;
}
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

export function SignatureTemplate({ markdownContent }: SignatureTemplateProps) {
  const content = prettify(markdownContent);

  return (
    <Row>
      <Column valign="top" width={210}>
        <Row>
          <Column width={181}>
            <Link href="https://www.ec-nantes.fr" rel="noopener noreferer">
              <Img
                src={`${location.origin}/static/img/logo_ecn.png`} // do not use relative path in emails
                alt="Centrale Nantes"
                width={160}
                style={{ ...fontStyles, marginTop: 6, marginBottom: 6 }}
              />
            </Link>
          </Column>
          <Column valign="middle">
            <div
              style={{
                width: 7,
                height: 40,
                backgroundColor: '#FAB600',
              }}
            />
          </Column>
        </Row>
      </Column>
      <Column>
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
  color: '#102648',
  fontFamily: 'Titillium, Titillium Web, Arial, sans-serif',
  fontSize: 'small',
};
