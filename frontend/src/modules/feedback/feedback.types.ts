export type FeedbackType = 'bug' | 'suggestion';

export interface FeedbackForm {
  title: string;
  description: string;
  type: FeedbackType;
}

export interface Feedback extends FeedbackForm {
  type: FeedbackType;
}
