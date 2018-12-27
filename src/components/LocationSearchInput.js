// Import React
import React, { Component } from 'react';

// Import Places Autocomplete component
import PlacesAutocomplete from './PlacesAutocomplete';

// Location search input component begins
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
                return <div className="div-test" {...getSuggestionItemProps(suggestion, {
                      className,
                      id,
                      style
                    })}>
                    <span id={this.props.id} className="span-test">{suggestion.description}</span>
                  </div>;
              })}
            </div>
          </div>}
      </PlacesAutocomplete>;
  }
}

export default LocationSearchInput;