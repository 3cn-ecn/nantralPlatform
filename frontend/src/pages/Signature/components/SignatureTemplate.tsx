import { Column } from '@react-email/column';
import { Img } from '@react-email/img';
import { Markdown } from '@react-email/markdown';
import { Row } from '@react-email/row';
import { CSSProperties } from 'react';

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
      <Column valign="top" width={200}>
        <Img
          src="https://www.ec-nantes.fr/medias/photo/v_logo-sign_1492585942308-png"
          alt="Centrale Nantes"
          width={184}
          style={fontStyles}
        />
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
