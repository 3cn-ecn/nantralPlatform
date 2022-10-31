import * as React from "react";
import { PinProps } from "./interfaces";

export function Pin(props: PinProps): JSX.Element {
  const size: number = 20;

  return (
    <svg
      style={{ transform: `translate(${-size / 2}px,${-size}px)` }}
      viewBox="0 0 512 512"
      width={props.size}
      height={props.size}
      onClick={props.onClick}
    >
      <path
        fill="#cc0000"
        d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
    c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
    c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
      />
    </svg>
  );
}
