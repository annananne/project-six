import React from "react";

//Component begins
const SidebarDirections = (props) => {
  function createMarkup(instruction) {
    return { __html: instruction };
  }

  if (props.directions) {
    return <div>
        <h3 style={{color: "white"}}>
        Start address: {props.directions.routes[props.routeIndex].legs[0].start_address}
        </h3>
      <h3 style={{ color: "white" }}>
        End address: {props.directions.routes[props.routeIndex].legs[0].end_address}
        </h3>
      <h3 style={{ color: "white" }}>
        Distance: {props.directions.routes[props.routeIndex].legs[0].distance.text}
      </h3>
      <h3 style={{ color: "white" }}>Time: {props.directions.routes[props.routeIndex].legs[0].duration.text}</h3>
      {props.directions.routes[props.routeIndex].legs[0].steps.map(step => {
        return <p style={{ color: "white" }} dangerouslySetInnerHTML={createMarkup(step.instructions)} />;
        })}
      </div>;
  }
  return null;
}

export default SidebarDirections;