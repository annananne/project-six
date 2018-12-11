import React, {Component} from "react";
import NewTripForm from './NewTripForm';
import CurrentTripInfo from './CurrentTripInfo';


const NewTripManager = (props) => {
  return (
    props.hasUserSubmitted ? (<CurrentTripInfo markers={props.markers} userTripPreferences={props.userTripPreferences} originDateTime={props.originDateTime} saveSearchResults={props.saveSearchResults} originData={props.originData} destinationData={props.destinationData} handleDirClick={props.handleDirClick} weatherResults={props.weatherResults} />) : (<NewTripForm originData={props.originData} destinationData={props.destinationData} userTripPreferences={props.userTripPreferences} userTripPreferences={props.userTripPreferences} originDateTime={props.originDateTime} saveSearchResults={props.saveSearchResults} handleDirClick={props.handleDirClick} handleMarkerClick={props.handleMarkerClick} markers={props.markers} handleReset={props.handleReset} handleSubmit={props.handleSubmit} handleChange={props.handleChange} handleSelect={props.handleSelect} handleDateTimeChange={props.handleDateTimeChange} handleRadioChange={props.handleRadioChange} handleCheckboxChange={props.handleCheckboxChange} />)
  

  )
  }
export default NewTripManager;