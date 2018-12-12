import React, { Component } from "react";
import MapWithADirectionsRenderer from "./DirectionsMap.js";

class CurrentTripInfo extends Component {
  render() {
    console.log('this.props.weatherResults inside CurrentTripInfo');
    console.log(this.props.weatherResults);

    return (
      <div>
        <MapWithADirectionsRenderer
          originDateTime={this.props.originDateTime}
          userTripPreferences={this.props.userTripPreferences}
          markers={this.props.markers}
          saveSearchResults={this.props.saveSearchResults}
          originData={this.props.originData}
          destinationData={this.props.destinationData}
          handleDirClick={this.props.handleDirClick}
          handleMarkerClick={this.props.handleMarkerClick}
          weatherResults={this.props.weatherResults}
          isLabelVisible={this.props.isLabelVisible}
          areDirectionsVisible={this.props.areDirectionsVisible}
          handleSidebarChange={this.props.handleSidebarChange}
        />
      </div>
    );
  }
}
export default CurrentTripInfo;