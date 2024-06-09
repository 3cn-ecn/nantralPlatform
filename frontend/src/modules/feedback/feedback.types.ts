export type FeedbackKind = 'bug' | 'suggestion';

export interface FeedbackForm {
  title: string;
  description: string;
  kind: FeedbackKind;
}
