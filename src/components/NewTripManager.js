import React, { Component } from "react";
import NewTripForm from "./NewTripForm";
import CurrentTripInfo from "./CurrentTripInfo";

const NewTripManager = props => {
  // return props.hasUserSubmitted ? (

  const allW = props.receivedAllWeatherData;
  // console.log("YEEEEEEEEEEEEEEEES inside NewTripManager");
  // console.log(allW);
  // console.log(props.weatherResults);
  // debugger

  // return props.receivedAllWeatherData ? (
  return props.hasUserSubmitted ? (
    <CurrentTripInfo
      userTripPreferences={props.userTripPreferences}
      originDateTime={props.originDateTime}
      saveSearchResults={props.saveSearchResults}
      originData={props.originData}
      destinationData={props.destinationData}
      handleDirClick={props.handleDirClick}
      weatherResults={props.weatherResults}
      receivedAllWeatherData={props.receivedAllWeatherData}
      handleMarkerClick={props.handleMarkerClick}
      isLabelVisible={props.isLabelVisible}
      areDirectionsVisible={props.areDirectionsVisible}
      handleSidebarChange={props.handleSidebarChange}

      // handler for saving trips to db
      handleSavingTripToDB={props.handleSavingTripToDB}

      handleReset={props.handleReset}
      // new 
      user={props.user}
      
    />
  ) : (
    <NewTripForm
      originData={props.originData}
      destinationData={props.destinationData}
      userTripPreferences={props.userTripPreferences}
      userTripPreferences={props.userTripPreferences}
      originDateTime={props.originDateTime}
      saveSearchResults={props.saveSearchResults}
      handleDirClick={props.handleDirClick}
      handleReset={props.handleReset}
      handleSubmit={props.handleSubmit}
      handleChange={props.handleChange}
      handleSelect={props.handleSelect}
      handleDateTimeChange={props.handleDateTimeChange}
      handleRadioChange={props.handleRadioChange}
      handleCheckboxChange={props.handleCheckboxChange}
      receivedAllWeatherData={props.receivedAllWeatherData}
    />
  );
};
export default NewTripManager;
