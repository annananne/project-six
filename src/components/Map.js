import React from "react";
import { compose, withProps } from "recompose";
import apiKeys from "../data/secrets";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import markers from "../markers";

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${
      apiKeys.googleMaps
    }&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: (
      <div style={{ height: `400px`, width: `80%`, margin: `0 auto` }} />
    ),
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: 43.6532, lng: -79.3832 }}>
      {/* {props.markers.map(item => {
        item.isMarkerShown ? (
          <Marker
            position={{ lat: `${marker.latitude}`, lng: `${marker.longitude}` }}
            onClick={props.onMarkerClick}
          />
        ) : (
          ""
        );
      })} */}
    {props.isMarkerShown && (
      <Marker
        position={{ lat: 43.6532, lng: -79.3832 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

class MyFancyComponent extends React.PureComponent {
  state = {
    markers: markers,
    isMarkerShown: false
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  render() {
    return (
      <MyMapComponent
        markers={this.state.markers}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

export default MyFancyComponent;
