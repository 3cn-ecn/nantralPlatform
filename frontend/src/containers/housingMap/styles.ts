import { CSSProperties } from "react";

export const clusterMarkerStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  width: "25px",
  height: "25px",
  lineHeight: "25px",
  borderRadius: "50%",
  fontSize: "1rem",
  color: "#fff",
  textAlign: "center",
  background: "#0079f2",
};

export const clusterMarkerContainerStyle: CSSProperties = {
  position: "relative",
  width: "35px",
  height: "35px",
  lineHeight: "35px",
  borderRadius: "50%",
  fontSize: "1rem",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  background: "#cce6ff",
};

export const geolocateStyle: CSSProperties = {
  top: 0,
  left: 0,
  margin: 10,
};

export const navControlStyle: CSSProperties = {
  right: 10,
  top: 10,
};

export const colocathlonSwitchDivStyle: CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
};

export const colocathlonSwitchChildStyle: CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: "1rem",
};

export const colocathlonSwitchElementStyle: CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  paddingTop: "0.4rem",
};

export const currentColocInfoStyles: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  minHeight: "2.3rem",
};
