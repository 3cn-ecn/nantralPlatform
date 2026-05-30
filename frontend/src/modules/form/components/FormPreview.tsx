import { useMemo, useState } from 'react';

import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { clone } from 'lodash';

import NumberControl, {
  numberControlTester,
} from '#modules/form/components/renderers/NumberControl';
import RichLabelRenderer, {
  richLabelRendererTester,
} from '#modules/form/components/renderers/RichLabelRenderer';
import SpinnerControl, {
  spinnerControlTester,
} from '#modules/form/components/renderers/SpinnerControl';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import { exportTree } from '#modules/form/state/JsonFormReducer';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function FormPreview() {
  const { jsonForm } = useJsonForm();
  const [data, setData] = useState({});
  const jsonFormSchema = useMemo(() => exportTree(jsonForm), [jsonForm]);
  return (
    <FlexCol gap={2}>
      {jsonForm && (
        <JsonForms
          schema={clone(jsonFormSchema.schema)}
          uischema={clone(jsonFormSchema.uiSchema)}
          data={data}
          renderers={[
            ...materialRenderers,
            {
              tester: richLabelRendererTester,
              renderer: RichLabelRenderer,
            },
            { tester: numberControlTester, renderer: NumberControl },
            {
              tester: spinnerControlTester,
              renderer: SpinnerControl,
            },
          ]}
          cells={materialCells}
          onChange={({ data }) => setData(data)}
        />
      )}
      {JSON.stringify(jsonFormSchema)}
    </FlexCol>
  );
}
