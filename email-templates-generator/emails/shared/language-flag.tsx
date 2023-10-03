import { CSSProperties } from 'react';

import { Img } from '@react-email/components';

type Lang = 'fr' | 'en';

const flags: Record<Lang, string> = {
  fr: 'fr',
  en: 'gb',
};

type Props = {
  lang: Lang;
};

const LanguageFlag = ({ lang }: Props) => {
  const flag = flags[lang];
  const altText = `[${lang.toUpperCase()}]`;

  return (
    <Img
      src={`https://www.drapeauxdespays.fr/data/flags/emoji/twitter/64x64/${flag}.png`}
      height="24px"
      style={flagStyle}
      alt={altText}
    />
  );
};

export default LanguageFlag;

const flagStyle: CSSProperties = {
  display: 'inline-block',
  marginRight: '8px',
  paddingBottom: '4px',
  verticalAlign: 'middle',
  fontSize: '16px',
};
