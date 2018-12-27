// Import React
import React from "react";

// Import all components
import CurrentTripInfo from "./CurrentTripInfo";
import NewTripForm from "./NewTripForm";

// New trip manager component begins
const NewTripManager = props => {
  // If user has submitted form, display current trip info component; if not, display new trip form component
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
      handleSidebarChange={props.handleSidebarChange}
      handleSavingTripToDB={props.handleSavingTripToDB}
      handleReset={props.handleReset}
      user={props.user}
      
    />
  ) : (
    <NewTripForm
      originData={props.originData}
      destinationData={props.destinationData}
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
