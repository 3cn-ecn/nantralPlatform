import { useObjectState } from '#shared/hooks/useObjectState';

import { Feedback, FeedbackForm } from '../feedback.types';

const defaultFeedbackFormValues: FeedbackForm = {
  title: '',
  description: '',
};

function convertToForm(feedback: Feedback): FeedbackForm {
  return {
    title: feedback.title,
    description: feedback.description,
  };
}

export function useFeedbackFormValues(feedback?: Feedback) {
  const defaultValues = feedback
    ? convertToForm(feedback)
    : defaultFeedbackFormValues;

  return useObjectState(defaultValues);
}
