import React from "react";
import {
  compose,
  withProps,
  withHandlers,
  withState,
  lifecycle
} from "recompose";
import apiKeys from "../data/secrets";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  GoogleMapsEvent,
  DirectionsRenderer
} from "react-google-maps";
import Directions from "./Directions.js";
// import markers from "../markers";

// const { compose, withProps, lifecycle } = require("recompose");
// const {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   DirectionsRenderer
// } = require("react-google-maps");

// const myMap = withScriptjs(withGoogleMap(props => <GoogleMap />));
const {
  MarkerWithLabel
} = require("react-google-maps/lib/components/addons/MarkerWithLabel");

const stylesArray = [
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [
      {
        visibility: "on"
      },
      {
        color: "#e0efef"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [
      {
        visibility: "on"
      },
      {
        hue: "#1900ff"
      },
      {
        color: "#c0e8e8"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        lightness: 100
      },
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        visibility: "on"
      },
      {
        lightness: 700
      }
    ]
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      {
        color: "#7dcdcd"
      }
    ]
  }
];

const MapWithADirectionsRenderer = compose(
  withProps(props => {
    return {
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
      apiKeys.googleMaps
    }&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: (
      <div style={{ height: `100vh`, minHeight: `650px`, width: `100%` }} />
    ),
  }
}),
  withState({
    markerInfo: null
  }),
  withScriptjs,
  withGoogleMap,
  // withHandlers({
  //   // handleMarkerClick: () => marker => {
  //   //   // const markerTitle = marker.wa.target.title;
  //   //   // const markerLat = marker.latLng.lat();
  //   //   // const markerLng = marker.latLng.lng();
  //   //   // console.log(markerTitle, markerLat, markerLng);
  //   //   // const markersArray = this.state.markers;
  //   //   // markersArray[markerTitle].isShown = !markersArray[markerTitle].isShown;
  //   //   // this.setState({
  //   //   //   markers: markersArray
  //   //   // });
  //   // }
  // }),
  lifecycle({
    componentDidMount() {
      console.log('inside component did mount', this.props.weatherResults)
      // const markerArray = this.props.weatherResults;
      // this.setState({
      //   markerInfo: markerArray
      // })
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: new window.google.maps.LatLng(
            this.props.originData.latitude,
            this.props.originData.longitude
          ),
          destination: new window.google.maps.LatLng(
            this.props.destinationData.latitude,
            this.props.destinationData.longitude
          ),
          travelMode:
            window.google.maps.TravelMode[
              this.props.userTripPreferences.travelMode
            ],
          drivingOptions: {
            departureTime: new Date(this.props.originDateTime)
          },
          provideRouteAlternatives: true,
          avoidFerries: this.props.userTripPreferences.avoidFerries,
          avoidHighways: this.props.userTripPreferences.avoidHighways,
          avoidTolls: this.props.userTripPreferences.avoidTolls
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log(result);
            this.props.saveSearchResults(result);
            this.setState({
              directions: result,
              // new
              // weatherResults: this.props.weatherResults,
              markerInfo: this.props.weatherResults
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    },
    componentDidUpdate(prevProps) {
      console.log('inside cdu, i have updated', this.props.weatherResults);
      // console.log(new Date(this.props.originDateTime));
      console.log(this.props.weatherResults, prevProps.weatherResults);
      // console.log("new props");
      // console.log(props.)
      const DirectionsService = new window.google.maps.DirectionsService();
      if (this.props.weatherResults !== prevProps.weatherResults) {
        console.log('i am running if statement inside cdu')
        this.setState({ markerInfo: this.props.weatherResults });
        // console.log('i am marker info inside cdu', this.state.markerInfo)

        DirectionsService.route(
          {
            origin: new window.google.maps.LatLng(
              this.props.originData.latitude,
              this.props.originData.longitude
            ),
            destination: new window.google.maps.LatLng(
              this.props.destinationData.latitude,
              this.props.destinationData.longitude
            ),
            travelMode:
              window.google.maps.TravelMode[
              this.props.userTripPreferences.travelMode
              ],
            drivingOptions: {
              departureTime: new Date(this.props.originDateTime)
            },
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
      // console.log('i am marker info inside cdu but outside if statement', this.state.markerInfo)
    }
  })
)(props => {
  return (
    <div>
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new window.google.maps.LatLng(41.85073, -87.65126)}
        defaultOptions={{ styles: stylesArray }}
      >
        {/* Old Directions renderer with multiple routes */}
        {/* {props.directions &&
        props.directions.routes.map((item, i) => {
          return (
            <div>
              <DirectionsRenderer
                directions={props.directions}
                routeIndex={i}
                suppressInfoWindows={true}
                options={{
                  polylineOptions: {
                    strokeColor: "#f9d549",
                    strokeOpacity: 0.75,
                    strokeWeight: 6
                  },
                  markerOptions: { opacity: 1, clickable: false }
                }}
                onClick={props.handleDirClick}
              />
              <Directions directions={props.directions} routeIndex={i} />
            </div>
          );
        })} */}


        {props.directions && (
          <div>
            <DirectionsRenderer
              directions={props.directions}
              routeIndex={1}
              suppressInfoWindows={true}
              options={{
                polylineOptions: {
                  strokeColor: "#f9d549",
                  strokeOpacity: 0.75,
                  strokeWeight: 6
                },
                markerOptions: { opacity: 1, clickable: false }
              }}
              onClick={props.handleDirClick}
            />
            <Directions directions={props.directions} routeIndex={1} />

            {props.directions.routes.length > 1 && props.directions.routes.map(route => {
              return <button id={route}>{route.summary}</button>;
            })}
          </div>
        )}



        {/* {props.markers && props.markers.map(marker => {
        return <div>
            <MarkerWithLabel position={{ lat: marker.latitude, lng: marker.longitude }} labelAnchor={new window.google.maps.Point(0, 0)} labelStyle={{ backgroundColor: "lightgrey", fontSize: "0.7rem", padding: "10px", textAlign: "left", width: "200px" }} labelVisible={marker.isLabelVisible} onClick={props.handleMarkerClick}>
              <div>
                <h3>{marker.title}</h3>
                <p>
                Location: ({marker.latitude}, {marker.longitude})
                </p>
              </div>
            </MarkerWithLabel>
          </div>;
      })
      } */}

        { props.weatherResults &&
          props.weatherResults.map(result => {
            console.log('##########################')
            console.log(result);
            return (
              <div>
                <MarkerWithLabel
                  position={{ lat: result.latitude, lng: result.longitude }}
                  labelAnchor={new window.google.maps.Point(0, 0)}
                  labelStyle={{
                    backgroundColor: "lightgrey",
                    fontSize: "0.7rem",
                    padding: "10px",
                    textAlign: "left",
                    width: "200px"
                  }}
                  labelVisible={true}
                  onClick={props.handleMarkerClick}
                >
                  <div>
                    <p>
                      Location: ({result.latitude}, {result.longitude})
                  </p>
                    <p>
                      {result.currently.summary} (
                    {result.currently.temperature}°F)
                  </p>
                  </div>
                </MarkerWithLabel>
              </div>
            );
          })}
      </GoogleMap>
    </div>
  )
}
  );
export default MapWithADirectionsRenderer;
