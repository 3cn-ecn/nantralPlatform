export async function copyAsPlainText(markdownContent: string) {
  const plainText = markdownContent.replaceAll('*', '').replaceAll(/#\s*/g, '');
  try {
    await navigator.clipboard.writeText(plainText);
  } catch {
    // continue regardless of error
  }
  return plainText;
}
