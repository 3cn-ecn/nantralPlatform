import { render } from '@react-email/render';

import { GroupPreview } from '#modules/group/types/group.types';

import { SignatureTemplate } from '../SignatureTemplate';

export async function copyAsHtml(
  markdownContent: string,
  group?: GroupPreview,
) {
  const htmlCode = await render(
    <SignatureTemplate markdownContent={markdownContent} group={group} />,
  );
  const element = document.createElement('div');
  element.innerHTML = htmlCode.trim();

  try {
    const type = 'text/html';
    const blob = new Blob([element.innerHTML], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
  } catch {
    // continue regardless of error
  }

  return element.firstChild;
}
