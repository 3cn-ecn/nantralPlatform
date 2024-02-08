import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { FeedbackType, FeedbackForm } from '../feedback.types';

export async function submitFeedback(
  type: FeedbackType,
  formData: FeedbackForm,
) {
  const { status } = await axios
    .post('/api/home/feedback/', {
      type,
      description: formData.description,
      title: formData.title,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
