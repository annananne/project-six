import React, { Component } from "react";
import MapWithADirectionsRenderer from "./DirectionsMap.js";

//Component begins
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
          handleSidebarChange={this.props.handleSidebarChange}

          // handler for saving trips to db
          handleSavingTripToDB={this.props.handleSavingTripToDB}

          handleReset={this.props.handleReset}
          // new
          user={this.props.user}
        />
      </div>
    );
  }
}
export default CurrentTripInfo;