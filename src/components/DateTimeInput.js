import React, { Component } from "react";

class DateTimeInput extends Component {
  render() {
    return(
      <div className="date-time">
        <label htmlFor="date-time-input">Choose date and time for departure:</label>
        <input
          type="datetime-local"
          id="date-time-input"
          name="date-time-input"
          value={this.props.dateString}
          onChange={this.props.handleDateTimeChange}
          // min="2018-06-07T00:00"
          // max="2018-06-14T00:00"
        />
      </div>
    )
  }
}

export default DateTimeInput;