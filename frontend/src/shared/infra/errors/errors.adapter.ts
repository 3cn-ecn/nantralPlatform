import { ApiErrorDTO, ApiFormErrorDTO } from './errors.dto';
import { ApiError, ApiFormError } from './errors.types';

export function adaptApiFormErrors<DTO>(
  error: ApiFormErrorDTO<DTO>,
): ApiFormError<DTO> {
  if (error.response) {
    if (error.response.data) {
      const djangoError = error.response.data;

      return {
        fields: djangoError,
        globalErrors: [
          djangoError.detail || '',
          ...(djangoError.non_field_errors || []),
        ].filter((x) => x),
        status: error.response.status,
        ...error,
      };
    }

    return {
      fields: {},
      globalErrors: [`Error ${error.response.status}`],
      status: error.response.status,
      ...error,
    };
  }

  if (error.message) {
    return { fields: {}, globalErrors: [error.message], ...error };
  }

  return { fields: {}, globalErrors: ['Unknown error'], ...error };
}

export function adaptApiErrors(error: ApiErrorDTO): ApiError {
  const adaptedError = adaptApiFormErrors(error);
  return {
    ...adaptedError,
    message: adaptedError.globalErrors[0],
  };
}
