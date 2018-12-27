import React, { Component } from 'react';
import SidebarOverview from './SidebarOverview';
import { Link } from "react-router-dom";

//Component begins
class SidebarMain extends Component {
  constructor() {
    super();
    this.state = {
      indexOfTabShown: 0,
    }
  }

  handleShowDirections = () => {
    this.setState({
      indexOfTabShown: 0,
    })
  }

  handleShowWeatherSummary = () => {
    this.setState({
      indexOfTabShown: 1,
    })
  }

  render() {
    const {
      directions,
      routeIndex, // for directions
      weatherData,
      handleSavingTripToDB,
      user,
    } = this.props;

    return (
      <div className="SidebarMain">
        {/* Container for buttons */}
        <div className="tab-container">
          <button
            className={`tab-content ${this.state.indexOfTabShown === 0 ? 'selected main-button sidebar-tab-button option-label' : 'main-button sidebar-tab-button option-label'}`}
            onClick={this.handleShowDirections}
          >Directions
          </button>
          <button
            className={`tab-content ${this.state.indexOfTabShown === 1 ? 'selected main-button sidebar-tab-button option-label' : 'main-button sidebar-tab-button option-label'}`}
            onClick={this.handleShowWeatherSummary}
          >Weather Summary
          </button>
        </div>
        {/* Container for the content */}
        <div>

          {/* case 0 */}
          <div
            className={`tab-content ${this.state.indexOfTabShown === 0 ? 'tab-content-shown' : ''}`}
            id="right-panel"
            routeIndex={1}>
          </div>

          {/* case 1 */}
          <div className={`tab-content ${this.state.indexOfTabShown === 1 ? 'tab-content-shown' : ''}`}>
            <SidebarOverview
              weatherData={this.props.weatherData}
            />
          </div>
          
          
          </div>
        <div className="footer-buttons">
          <button className="button"
            // disabled={user === null}
            onClick={this.props.handleSavingTripToDB}
          >
            {user !== null ? 'Save trip' : 'Log in to save trip'}
          </button>
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