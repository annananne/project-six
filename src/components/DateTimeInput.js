// Import React
import React, { Component } from "react";

// Import all styles
import '../styles/DateTimeInput.css';

//Component begins
class DateTimeInput extends Component {
  render() {
    return(
      <div className="date-time">
        <label htmlFor="date-time-input" className="form-label">Choose a date and time for departure</label>
        <input
          type="datetime-local"
          id="date-time-input"
          name="date-time-input"
          value={this.props.dateString}
          onChange={this.props.handleDateTimeChange}
        />

      </div>
    )
  }
}

export default DateTimeInput;