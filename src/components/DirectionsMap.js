import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import apiKeys from "../data/secrets";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  DirectionsRendererOptions
} from "react-google-maps";
import Directions from './Directions.js'
// import markers from "../markers";

// const { compose, withProps, lifecycle } = require("recompose");
// const {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   DirectionsRenderer
// } = require("react-google-maps");

// const myMap = withScriptjs(withGoogleMap(props => <GoogleMap />));
const stylesArray = [
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#e0efef"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "hue": "#1900ff"
      },
      {
        "color": "#c0e8e8"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 100
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 700
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#7dcdcd"
      }
    ]
  }
]

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
      apiKeys.googleMaps
    }&v=3.exp&libraries=geometry,drawing,places'goo`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: (
      <div style={{ height: `100vh`, minHeight: `650px`, width: `40%` }} />
    )
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new window.google.maps.DirectionsService();

      console.log(new Date(this.props.originDateTime));
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
          travelMode: window.google.maps.TravelMode["DRIVING"],
          drivingOptions: {departureTime: new Date(this.props.originDateTime)},
          provideRouteAlternatives: true,
          avoidFerries: this.props.userTripPreferences.avoidFerries,
          avoidHighways: this.props.userTripPreferences.avoidHighways,
          avoidTolls: this.props.userTripPreferences.avoidTolls
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log(result);
            this.props.saveSearchResults(result);
            this.setState({ directions: result });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  })
)(props => (
  <div>
    <GoogleMap
      defaultZoom={7}
      defaultCenter={new window.google.maps.LatLng(41.85073, -87.65126)}
      defaultOptions={{ styles: stylesArray }}
    >
      {props.directions && props.directions.routes.map((item, i) => {
        return <div>
            <DirectionsRenderer directions={props.directions} routeIndex={i} />
            <Directions directions={props.directions} routeIndex={i} />
          </div>;
      })
    }
    </GoogleMap>
  </div>
));

{/* <MapWithADirectionsRenderer />; */}

export default MapWithADirectionsRenderer;
