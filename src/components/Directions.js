import React from "react";

const Directions = (props) => {
  // return <p>Hello</p>
  function createMarkup(instruction) {
    return { __html: instruction };
  }

  if (props.directions) {
    return <div>
        <h3>
        Start address: {props.directions.routes[props.routeIndex].legs[0].start_address}
        </h3>
        <h3>
        End address: {props.directions.routes[props.routeIndex].legs[0].end_address}
        </h3>
        <h3>
        Distance: {props.directions.routes[props.routeIndex].legs[0].distance.text}
        </h3>
      <h3>Time: {props.directions.routes[props.routeIndex].legs[0].duration.text}</h3>
      {props.directions.routes[props.routeIndex].legs[0].steps.map(step => {
          return <p dangerouslySetInnerHTML={createMarkup(step.instructions)} />;
        })}
      </div>;
  }
  return null;
}

export default Directions;