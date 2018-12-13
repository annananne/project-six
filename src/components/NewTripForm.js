import React, { Component } from "react";
import ReactDependentScript from "react-dependent-script";
import apiKeys from "../data/secrets";
import LocationSearchInput from "./LocationSearchInput";
import DateTimeInput from "./DateTimeInput";
import { Link } from "react-router-dom";
import CurrentTripInfo from "./CurrentTripInfo";

// styling
import "../App.css";
import mockImage from "../assets/mockImage.jpg";

//Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faEllipsisV, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'

library.add(faCircle, faEllipsisV, faMapMarkerAlt); 

class NewTripForm extends Component {
  render() {
    return <div className="main-wrapper clearfix">

        <div className="newtripform-wrapper clearfix">

          <h3>New trip</h3>
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places,geometry,drawing`]}>
            <form className="new-trip-form clearfix" action="" onSubmit={this.props.handleSubmit}>
              {/* <form action="" onSubmit={this.handleSubmit}> */}
              {/* Input for origin point search */}

              <div className= "font-awesome clearfix">
                <div className= "icon">
                  <FontAwesomeIcon className="circle" icon="circle" /> 
                </div>
                <div className="icon">
                  <FontAwesomeIcon className="dotdots" icon="ellipsis-v" />
                </div>
                <div className="icon">
                  <FontAwesomeIcon className= "markymark" icon="map-marker-alt" />
                </div>
              </div>

              <div className="location-search-input-wrapper">
              <LocationSearchInput id="originData" address={this.props.originData.address} originData={this.props.originData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
              {/* Input for destination point search */}
              <LocationSearchInput id="destinationData" address={this.props.destinationData.address} destinationData={this.props.destinationData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />

              <DateTimeInput dateString={this.props.originDateTime} handleDateTimeChange={this.props.handleDateTimeChange} />
              
              </div>

              {/* <LocationSearchInput id="originData" address={this.props.originData.address} originData={this.props.originData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} /> */}
              {/* Input for destination point search */}
              {/* <LocationSearchInput id="destinationData" address={this.props.destinationData.address} destinationData={this.props.destinationData} handleChange={this.props.handleChange} handleSelect={this.props.handleSelect} />
              <DateTimeInput dateString={this.props.originDateTime} handleDateTimeChange={this.props.handleDateTimeChange} /> */}


              <ul className="transportation">
                <fieldset>
                  <li>
                    <label htmlFor="driving">Driving</label>
                    <input type="radio" id="driving" name="travelMode" value="DRIVING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "DRIVING" // className="no-display"
                      } />
                  </li>

                  <li>
                    <label htmlFor="bicycling">Bicycling</label>
                    <input type="radio" id="bicycling" name="travelMode" value="BICYCLING" onChange={this.props.handleRadioChange} checked={this.props.userTripPreferences.travelMode === "BICYCLING"} />
                  </li>
                </fieldset>
              </ul>


              <fieldset className="avoid-mode">
                <label htmlFor="ferries">Avoid ferries</label>
                <input type="checkbox" id="ferries" name="avoidFerries" onChange={this.props.handleCheckboxChange} />

                <label htmlFor="highways">Avoid highways</label>
                <input type="checkbox" id="highways" name="avoidHighways" onChange={this.props.handleCheckboxChange} />

                <label htmlFor="tolls">Avoid tolls</label>
                <input type="checkbox" id="tolls" name="avoidTolls" onChange={this.props.handleCheckboxChange} />
              </fieldset>

              {/* <Link to="/tripdetails"> */}
                <input className="button" type="submit" value="Let's go" />
              {/* </Link> */}

              {/* <input type="submit" value="Get recommendation" /> */}

            </form>
          </ReactDependentScript>
        </div>
         < img src={mockImage} alt="A person in the passenger seat of a car looking at a map." />
      </div>
  //     }

  //       <div className="image-wrapper">
  //         <img src={mockImage} alt="A person in the passenger seat of a car looking at a map." />
  //       </div>
  //     </div>;
  }
}

export default NewTripForm;
