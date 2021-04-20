import * as React from "react";
import { Component, PureComponent } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, { Marker } from "react-map-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2FycnVzIiwiYSI6ImNrbnFkNWJ4OTBkbmsydm8xODUxeWpreXYifQ.Dxzk0dSDBhl-NsqemdsUrw"; // Set your mapbox token here

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

class CityPin extends PureComponent {
  render() {
    const { size = 20, onClick } = this.props;

    return (
      <svg
        height={size}
        viewBox="0 0 24 24"
        fill="#c20000"
        onClick={onClick}
      >
        <path d={ICON} />
      </svg>
    );
  }
}

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 47.21784689284845,
        longitude: -1.5586376015280996,
        zoom: 12,
        bearing: 0,
        pitch: 0,
      },
      markers: [],
    };
  }

  componentDidMount() {
    // Simple GET request with a JSON body using fetch
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/roommates/api/roommates/housing/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        var Markers = [];
        data.forEach((housing) => {
          Markers.push(
            <Marker
              key={housing.adress}
              longitude={housing.longitude}
              latitude={housing.latitude}
            >
              <CityPin
                size={20}
                onClick={() => this.setState({ popupInfo: "test" })}
              />
            </Marker>
          );
        });
        return this.setState({ markers: Markers });
      });
  }

  render() {
    return (
      <MapGL
        {...this.state.viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {this.state.markers}
      </MapGL>
    );
  }
}

document.body.style.margin = 0;
render(<Root />, document.getElementById("root"));
