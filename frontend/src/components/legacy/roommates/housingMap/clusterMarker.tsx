import * as React from "react";

import { clusterMarkerStyle, clusterMarkerContainerStyle } from "./styles";

export function ClusterMarker(props): JSX.Element {
  const { cluster, onClick } = props;

  return (
    <div style={clusterMarkerContainerStyle} onClick={onClick}>
      <div style={clusterMarkerStyle} onClick={onClick}>
        {cluster.properties.point_count}
      </div>
    </div>
  );
}
