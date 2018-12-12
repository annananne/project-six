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
// import SidebarDirections from "./SidebarDirections.js";
// import SidebarOverview from './SidebarOverview.js';
import SidebarMain from './SidebarMain';


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
        <div style={{ height: `100vh`, minHeight: `650px`, width: `65%`, float: 'left', display: 'block' }} />
      ),
    }
  }),
  withState({
    markerInfo: null,
  }),
  withScriptjs,
  withGoogleMap,
  withHandlers({
    // handleMarkerClick: () => marker => {
    //   // const markerTitle = marker.wa.target.title;
    //   // const markerLat = marker.latLng.lat();
    //   // const markerLng = marker.latLng.lng();
    //   // console.log(markerTitle, markerLat, markerLng);
    //   // const markersArray = this.state.markers;
    //   // markersArray[markerTitle].isShown = !markersArray[markerTitle].isShown;
    //   // this.setState({
    //   //   markers: markersArray
    //   // });
    // }
  }),
  lifecycle({
    componentDidMount() {
      console.log('inside component did mount', this.props.weatherResults)
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
      console.log(this.props.weatherResults, prevProps.weatherResults);
      // console.log("new props");
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

        {props.directions && (
          <div>
            <DirectionsRenderer
              directions={props.directions}
              routeIndex={1}
              suppressInfoWindows={true}
              options={{
                polylineOptions: {
                  strokeColor: "#222449",
                  strokeOpacity: 0.5,
                  strokeWeight: 6
                },
                markerOptions: { opacity: 0, clickable: false }
              }}
              onClick={props.handleDirClick}
              panel={document.getElementById('right-panel')}
            />
            <div style={{ background: 'white' }}>
              <button onClick={props.handleSidebarChange}>Directions</button>
              <button onClick={props.handleSidebarChange}>Overview</button>
            </div>


            {/* 
              Experimental - component to switch between the
              directions and weather summary
              I've kept the previous version below
              (commented out in case we need it)
             */}
            {/* <SidebarMain
              // info for directions tab
              directions={props.directions}
              routeIndex={1}
              // info for weather summary tab
              weatherData={props.weatherResults}
            /> */}
        
            {/* OLD VERSION: COMMENTED OUT */}
            {/* <button onClick={props.handleSidebarChange}>Directions</button>
            <button onClick={props.handleSidebarChange}>Overview</button> */}

            {/* { props.areDirectionsVisible ?
            <SidebarDirections directions={props.directions} routeIndex={1} /> : <SidebarOverview weatherData={props.weatherResults} />} */}


              {props.areDirectionsVisible ?
              <div id="right-panel"></div> : <SidebarMain directions={props.directions}
                routeIndex={1} weatherData={props.weatherResults}/>}
            </div>
          
        )}

        {props.weatherResults &&
          props.weatherResults.map((result, i) => {
            return (
              <div>
                <MarkerWithLabel
                  position={{ lat: result.latitude, lng: result.longitude }}
                  labelAnchor={new window.google.maps.Point(0, 0)}
                  labelStyle={{
                    backgroundColor: "rgba(255,255,255,0.75)",
                    border: "rgba(0,0,0,0.2) 0.5px solid",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05rem",
                    padding: "0 15px",
                    textAlign: "left",
                    width: "250px",
                    height: "150px",
                    overflowY: "scroll"
                  }}
                  labelVisible={props.isLabelVisible[i]}
                  onClick={() => { props.handleMarkerClick(i) }}
                >
                  <div>
                    <p>
                      {result.currently.summary}<span style={{ fontSize: '12px', opacity: '0.75' }}> ({Math.round(result.latitude * 100) / 100}, {Math.round(result.longitude * 100) / 100})</span>
                      
                    </p>
                    <p>
                      {Math.ceil((5 / 9) * (result.currently.temperature - 32))}°C 
                      <span style={{ fontSize: '12px', marginLeft: '10px', opacity: '0.75', marginRight: '5px' }}> feels like</span>
                      {Math.ceil((5 / 9) * (result.currently.apparentTemperature - 32))}°C 
                  </p>
                    {result.precipType && <p>{result.currently.precipProbability}%<span style={{ fontSize: '12px', opacity: '0.75' }}> chance of {result.currently.precipType}</span></p>}
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
