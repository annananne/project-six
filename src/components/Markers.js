import React, { Component } from "react";

export let markerArray = [];

class Markers extends Component{
  render(){
    return (
      <div>
        <p>markers</p>
      </div>
    )
  }
  componentDidUpdate(prevProps){
    if (prevProps.weatherResults.length !== this.props.weatherResults.length) {
      this.props.weatherResults.map(result => {
        markerArray.push(result);
      })
    }
  }
}

// class Markers extends Component {
//   render(){
//     return <div>{console.log(this.props)} A</div>;
//   }
// }

export default Markers;