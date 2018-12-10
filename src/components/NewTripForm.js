import React, { Component } from "react";
import ReactDependentScript from "react-dependent-script";
import apiKeys from "../data/secrets";
import LocationSearchInput from "./LocationSearchInput";
import DateTimeInput from "./DateTimeInput";
import { Link } from "react-router-dom";
import CurrentTripInfo from './CurrentTripInfo';

class NewTripForm extends Component {
  render() {
    return <div>
        <form action="" onSubmit={this.props.handleSubmit}>
          {/* <form action="" onSubmit={this.handleSubmit}> */}
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places,geometry,drawing`]}>
            {/* Input for origin point search */}
            <LocationSearchInput id="originData" address={this.props.originData.address} originData={this.props.originData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
            {/* Input for destination point search */}
            <LocationSearchInput id="destinationData" address={this.props.destinationData.address} destinationData={this.props.destinationData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
            <DateTimeInput dateString={this.props.originDateTime} handleDateTimeChange={this.props.handleDateTimeChange} />
            <fieldset>
              <label htmlFor="driving">Driving</label>
              <input type="radio" id="driving" name="travelMode" value="DRIVING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "DRIVING" // className="no-display"
                } />

              <label htmlFor="bicycling">Bicycling</label>
              <input type="radio" id="bicycling" name="travelMode" value="BICYCLING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "BICYCLING"} />
            </fieldset>
            <fieldset>
              <label htmlFor="ferries">Avoid ferries</label>
              <input type="checkbox" id="ferries" name="avoidFerries" onChange={this.props.handleCheckboxChange} />

              <label htmlFor="highways">Avoid highways</label>
              <input type="checkbox" id="highways" name="avoidHighways" onChange={this.props.handleCheckboxChange} />

              <label htmlFor="tolls">Avoid tolls</label>
              <input type="checkbox" id="tolls" name="avoidTolls" onChange={this.props.handleCheckboxChange} />
            </fieldset>
          <Link to="/tripdetails"><input type="submit" value="Get recommendation" /></Link>
          </ReactDependentScript>
        </form>
      </div>
      }
  }

export default NewTripForm;
