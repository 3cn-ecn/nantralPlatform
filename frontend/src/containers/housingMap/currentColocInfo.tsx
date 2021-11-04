import * as React from "react";

import { currentColocInfoStyles } from "./styles";
import { CurrentColocInfoProps } from "./interfaces";

export function CurrentColocInfo(props: CurrentColocInfoProps) {
  const { colocName, colocUrl } = props;

  if (colocName === "") {
    return (
      <div className="col" style={currentColocInfoStyles}>
        <h5>Tu n'es inscrit.e à aucune coloc. Choisis-en une sur la carte!</h5>
      </div>
    );
  }
  return (
    <div className="col" style={currentColocInfoStyles}>
      <h5>
        Tu es inscrit.e à <a href={colocUrl}>{colocName}</a>
      </h5>
    </div>
  );
}
