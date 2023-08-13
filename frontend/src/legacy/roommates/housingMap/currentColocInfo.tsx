import * as React from 'react';

import { currentColocInfoStyles } from './styles';
import { CurrentColocInfoProps } from './interfaces';

export function CurrentColocInfo(props: CurrentColocInfoProps) {
  const { colocName, colocUrl } = props;

  if (colocName === '') {
    return (
      <div className="col-12 col-sm-6" style={currentColocInfoStyles}>
        <p className="mb-0">
          Tu n'es inscrit·e à aucune coloc. Choisis-en une sur la carte !
        </p>
      </div>
    );
  }
  return (
    <div className="col-12 col-sm-6" style={currentColocInfoStyles}>
      <p className="mb-0">
        Tu es inscrit·e à <a href={colocUrl}>{colocName}</a>
      </p>
    </div>
  );
}
