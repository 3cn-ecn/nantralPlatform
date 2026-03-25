import { ErrorObject } from 'ajv';

import { JsonFormErrorDTO } from '#modules/form/infra/jsonFormError.dto';

export function adaptJsonFormError(error: JsonFormErrorDTO): ErrorObject {
  return {
    keyword: error.validator,
    message: error.message,
    instancePath: '/' + error.absolute_path.join('/'),
    schemaPath: '#/' + error.absolute_schema_path.join('/'),
    params: {},
  };
}
