import { JsonFormSchemaDTO } from '#modules/form/infra/jsonForm.dto';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';

export const convertJsonFormSchema = (
  schema: Omit<JsonFormSchema, 'uuid'>,
): Omit<JsonFormSchemaDTO, 'uuid'> => {
  return {
    name: schema.name,
    description: schema.description,
    schema: schema.schema,
    ui_schema: schema.uiSchema,
    i18n_keys_en: schema.i18nKeys.en,
    i18n_keys_fr: schema.i18nKeys.fr,
  };
};
