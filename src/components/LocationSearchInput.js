import React, { Component } from 'react';
// import PlacesAutocomplete from 'react-places-autocomplete';
import PlacesAutocomplete from './PlacesAutocomplete';
import {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

class LocationSearchInput extends Component {
  render() {
    return <PlacesAutocomplete id={this.props.id} value={this.props.address} onChange={this.props.handleChange} onSelect={this.props.handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => <div>

            <input {...getInputProps({
                placeholder: "Search a location...",
                className: "location-search-input",
                id: `${this.props.id}`
              })} />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                const id = `${this.props.id}`;
                // inline style for demonstration purpose
                const style = suggestion.active ? { backgroundColor: "#fafafa", cursor: "pointer" } : { backgroundColor: "#ffffff", cursor: "pointer" };
                return <div {...getSuggestionItemProps(suggestion, {
                      className,
                      id,
                      style
                    })}>
                    <span id={this.props.id}>{suggestion.description}</span>
                  </div>;
              })}
            </div>
          </div>}
      </PlacesAutocomplete>;
  }
}

export default LocationSearchInput;