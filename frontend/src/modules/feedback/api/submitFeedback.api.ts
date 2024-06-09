import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { FeedbackForm } from '../feedback.types';

export async function submitFeedback(formData: FeedbackForm) {
  const { status } = await axios
    .post('/api/home/feedback/', formData)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
