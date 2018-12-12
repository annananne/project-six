// receives data for both 
// the Overview and the Directions
// and manages the state 
// to show one or another
import React, { Component } from 'react';

import SidebarDirections from './SidebarDirections';
import SidebarOverview from './SidebarOverview';

class SidebarMain extends Component {
  constructor() {
    super();
    this.state = {
      indexOfTabShown: 0,
    }
  }

  // handleIndexChange = (i) => {
  //   this.setState({
  //     indexOfTabShown: i,
  //   });
  // }

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

  render () {
    const {
      directions,
      routeIndex, // for directions
      weatherData,
    } = this.props;

    return (
      <div className="SidebarMain">
        {/* Container for buttons */}
        <div className="tab-container">
          <button
            className="main-button sidebar-tab-button"
            onClick={this.handleShowDirections}
          >Directions</button>
          <button
            className="main-button sidebar-tab-button"
            onClick={this.handleShowWeatherSummary}
          >Weather Summary</button>
        </div>
        {/* Container for the content */}
        <div>
          {/* case 0 */}
          { this.state.indexOfTabShown === 0 && <SidebarDirections  
            directions={this.props.directions} 
            routeIndex={this.props.routeIndex}
          /> }

          {/* case 1 */}
          {this.state.indexOfTabShown === 1 && <SidebarOverview 
            weatherData={this.props.weatherData}
          /> }
        </div>

      </div>
    )
  }
}

export default SidebarMain;