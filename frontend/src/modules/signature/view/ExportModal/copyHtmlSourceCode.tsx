import { render } from '@react-email/render';

import { GroupPreview } from '#modules/group/types/group.types';

import { SignatureTemplate } from '../SignatureTemplate';

export async function copyHtmlSourceCode(
  markdownContent: string,
  group?: GroupPreview,
) {
  const htmlCode = render(
    <SignatureTemplate markdownContent={markdownContent} group={group} />,
  );
  try {
    await navigator.clipboard.writeText(htmlCode);
  } catch (error) {
    // continue regardless of error
  }
  return htmlCode;
}
