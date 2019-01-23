// Import React
import React, { Component } from 'react';

// Import Places Autocomplete component
import PlacesAutocomplete from './PlacesAutocomplete';

// Location search input component begins
class LocationSearchInput extends Component {
  shorten = desc => {
    let shortened = '';
    if (desc.length > 20) {
      shortened = `${desc.substr(0, 20)}...`;
    } else {
      shortened = desc;
    }
    
    return shortened;
  }
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
            const style = suggestion.active ? { backgroundColor: "rgba(255,255,255,0.75)", cursor: "pointer", padding: "1rem 0", display: "inline-block", width: '80%' } : { backgroundColor: "white", cursor: "pointer", padding: "1rem 0", display: "inline-block", width: '80%' };
                return <div className="div-test" style={{textAlign: "center"}} {...getSuggestionItemProps(suggestion, {
                      className,
                      id,
                      style
                    })}>
                    <span id={this.props.id} className="span-test">{this.shorten(suggestion.description)}</span>
                  </div>;
              })}
            </div>
          </div>}
      </PlacesAutocomplete>;
  }
}

export default LocationSearchInput;