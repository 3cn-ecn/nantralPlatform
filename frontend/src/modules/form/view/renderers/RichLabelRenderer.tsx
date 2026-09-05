import { LabelProps, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLabelProps } from '@jsonforms/react';

import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const richLabelRendererTester: RankedTester = rankWith(
  100,
  uiTypeIs('Label'),
);

/**
 * Default renderer for a label.
 */
export const RichLabelRenderer = ({ text, visible }: LabelProps) => {
  if (!visible || !text) {
    return null;
  }
  return <RichTextRenderer content={text} />;
};

export default withJsonFormsLabelProps(RichLabelRenderer);
