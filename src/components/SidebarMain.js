// Import React
import React, { Component } from 'react';

// Import all components
import SidebarOverview from './SidebarOverview';

// Sidebar begins
class SidebarMain extends Component {
  constructor() {
    super();
    this.state = {
      indexOfTabShown: 0,
    }
  }

  // Function to handle showing directions
  handleShowDirections = () => {
    // Set state of shown tab to 0
    this.setState({
      indexOfTabShown: 0,
    })
  }

  // Function to handle showing weather summary
  handleShowWeatherSummary = () => {
    // Set state of shown tab to 1
    this.setState({
      indexOfTabShown: 1,
    })
  }

  render() {
    const {
      // directions,
      // routeIndex, // for directions
      // weatherData,
      // handleSavingTripToDB,
      user,
    } = this.props;

    return (
      <div className="SidebarMain">
        {/* Container for toggle sidebar view buttons */}
        <div className="tab-container">
          {/* Directions toggle button - conditional rendering of underline styling based on whether tab content is active*/}
          <button
            className={`tab-content ${this.state.indexOfTabShown === 0 ? 'selected main-button sidebar-tab-button option-label' : 'main-button sidebar-tab-button option-label'}`}
            onClick={this.handleShowDirections}
          >Directions
          </button>
          {/* Weather summary toggle button - conditional rendering of underline styling based on whether tab content is active */}
          <button
            className={`tab-content ${this.state.indexOfTabShown === 1 ? 'selected main-button sidebar-tab-button option-label' : 'main-button sidebar-tab-button option-label'}`}
            onClick={this.handleShowWeatherSummary}
          >Summary
          </button>
        </div>

        {/* Container for sidebar content */}
        <div>
          {/* If index of shown tab is 0, show directions in sidebar using Google Maps component */}
          <div
            className={`tab-content ${this.state.indexOfTabShown === 0 ? 'tab-content-shown' : ''}`}
            id="right-panel"
            routeIndex={1}>
          </div>

          {/* If index of shown tab is 1, show weather summary in sidebar */}
          <div className={`tab-content ${this.state.indexOfTabShown === 1 ? 'tab-content-shown' : ''}`}>
            <SidebarOverview
              weatherData={this.props.weatherData}
            />
          </div>
        </div>

        {/* Container for footer action buttons */}
        <div className="footer-buttons">
          {/* Save trip button - conditional rendering of text based on whether user is logged in*/}
          <button className="button"
            onClick={this.props.handleSavingTripToDB}
          >
            {user !== null ? 'Save trip' : 'Log in to save trip'}
          </button>
          {/* Reset button */}
          <button className="button"
            onClick={this.props.handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    )
  }
}

export default SidebarMain;