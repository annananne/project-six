import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import apiKeys from "../data/secrets";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";
// import markers from "../markers";

// const { compose, withProps, lifecycle } = require("recompose");
// const {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   DirectionsRenderer
// } = require("react-google-maps");

// const myMap = withScriptjs(withGoogleMap(props => <GoogleMap />));

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
      apiKeys.googleMaps
    }&v=3.exp&libraries=geometry,drawing,places'goo`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new window.google.maps.DirectionsService();

      DirectionsService.route(
        {
          origin: new window.google.maps.LatLng(
            this.props.originLat,
            this.props.originLong
          ),
          destination: new window.google.maps.LatLng(
            this.props.destinationLat,
            this.props.destinationLong
          ),
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            this.setState({ directions: result });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  })
)(props => (
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new window.google.maps.LatLng(41.85073, -87.65126)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

{/* <MapWithADirectionsRenderer />; */}

export default MapWithADirectionsRenderer;
