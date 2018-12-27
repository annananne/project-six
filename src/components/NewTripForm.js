// Import React, React Router, React Dependent Script packages
import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactDependentScript from "react-dependent-script";

// Import API keys
import apiKeys from "../data/secrets";

// Import all styles
import "../styles/NewTripForm.css";

// Import all components
import LocationSearchInput from "./LocationSearchInput";
import DateTimeInput from "./DateTimeInput";

// Import Font Awesome and add icons to library
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEllipsisV, faMapMarkerAlt, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faCircle, faEllipsisV, faMapMarkerAlt, faChevronLeft);

// New trip form component begins
class NewTripForm extends Component {
  render() {
    return <div className="new-trip-form">
      <div className="wrapper clearfix">
        <div className="half-section clearfix">
          {/* Link to return to dashboard page */}
          <Link className="button home-button" to="/dashboard">
            <FontAwesomeIcon icon="chevron-left" className="icon" />
            <p>Dashboard</p>
          </Link>
          <h2>New trip</h2>
          {/* React dependent script to wrap JavaScript tag load */}
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places,geometry,drawing`]}>
            <form className="new-trip-form clearfix" action="" onSubmit={this.props.handleSubmit}>
              <div className="location-search-input-wrapper">
                {/* Location search input component for origin point */}
                <label htmlFor="originData" className="form-label">Enter your starting point</label>
                <LocationSearchInput id="originData" address={this.props.originData.address} originData={this.props.originData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
                {/* Location search input component for destination point */}
                <label htmlFor="destinationData" className="form-label">Enter your destination</label>
                <LocationSearchInput id="destinationData" address={this.props.destinationData.address} destinationData={this.props.destinationData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
                {/* Input component for date and time */}
                <DateTimeInput dateString={this.props.originDateTime} handleDateTimeChange={this.props.handleDateTimeChange} />
              </div>
              {/* Transportation method selection */}
              <ul className="transportation">
                <label htmlFor="transportation" className="form-label">Choose your method of transportation</label>
                <fieldset id="transportation" className="clearfix">
                  {/* Radio button/label for driving */}
                  <li>
                    <label htmlFor="driving" className={this.props.userTripPreferences.travelMode === "DRIVING" ? 'option-label active-label' : 'option-label'}>Driving</label>
                    <input type="radio" id="driving" name="travelMode" value="DRIVING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "DRIVING"
                    } />
                  </li>
                  <li>
                    {/* Radio button/label for bicycling */}
                    <label htmlFor="bicycling" className={this.props.userTripPreferences.travelMode === "BICYCLING" ? 'option-label active-label' : 'option-label'}>Bicycling</label>
                    <input type="radio" id="bicycling" name="travelMode" value="BICYCLING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "BICYCLING"} />
                  </li>
                </fieldset>
              </ul>
              {/* Transportation options selection */}
              <label htmlFor="customize-options" className="form-label">Customize your options</label>
              <fieldset className="avoid-mode" id="customize-options">
                {/* Avoid ferries selection */}
                <label htmlFor="ferries" className={this.props.userTripPreferences.avoidFerries ? 'option-label active-label' : 'option-label'}>Avoid ferries</label>
                <input type="checkbox" id="ferries" name="avoidFerries" onChange={this.props.handleCheckboxChange} />
                {/* Avoid highways selection */}
                <label htmlFor="highways" className={this.props.userTripPreferences.avoidHighways ? 'option-label active-label' : 'option-label'}>Avoid highways</label>
                <input type="checkbox" id="highways" name="avoidHighways" onChange={this.props.handleCheckboxChange} />
                {/* Avoid tolls selection */}
                <label htmlFor="tolls" className={this.props.userTripPreferences.avoidTolls ? 'option-label active-label' : 'option-label'}>Avoid tolls</label>
                <input type="checkbox" id="tolls" name="avoidTolls" onChange={this.props.handleCheckboxChange} />
              </fieldset>
              {/* New trip form submission button */}
              <input className="button" type="submit" value="Let's go" />
            </form>
          </ReactDependentScript>
        </div>
        {/* Half page image of map */}
        <div className="half-section image">
        </div>
      </div>
    </div>;
  }
}

export default NewTripForm;
