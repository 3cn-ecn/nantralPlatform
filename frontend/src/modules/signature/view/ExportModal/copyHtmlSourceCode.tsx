import { render } from '@react-email/render';

import { SignatureTemplate } from '../SignatureTemplate';

export async function copyHtmlSourceCode(markdownContent: string) {
  const htmlCode = render(
    <SignatureTemplate markdownContent={markdownContent} />,
  );
  try {
    await navigator.clipboard.writeText(htmlCode);
  } catch (error) {
    // continue regardless of error
  }
  return htmlCode;
}
