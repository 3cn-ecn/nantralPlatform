import { ApiErrorDTO } from './errors.dto';
import { ApiError } from './errors.types';

export function adaptApiErrors<DTO>(error?: ApiErrorDTO<DTO>): ApiError<DTO> {
  if (error.response) {
    if (error.response.data) {
      const djangoError = error.response.data;
      return {
        ...djangoError,
        globalErrors: [
          djangoError.detail || '',
          ...(djangoError.non_field_errors || []),
        ].filter((x) => x),
      };
    }
    return { globalErrors: [`Error ${error.response.status}`] };
  }
  if (error.message) {
    return { globalErrors: [error.message] };
  }
  return { globalErrors: ['Unknown error'] };
}
