import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase.js";


class TripList extends Component {
    constructor() {
        super();
        this.state = {
            tripName: "",
            startPoint: "",
            endPoint: "",
            trips: [],
        }  
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const tripRef = firebase.database().ref('trips')
        const tripList= {
            title: this.state.tripName,
            origin: this.state.startPoint,
            destination: this.state.endPoint
        }
        tripRef.push(tripList);
        this.setState({
            tripName: "",
            startPoint: "",
            endPoint: ""
        });
    }

    componentDidMount() {
        const tripRef = firebase.database().ref("trips");
        tripRef.on('value', (snapshot) => {
            let trips = snapshot.val();
            let newState = [];
            for (let tripList in trips) {
                newState.push({
                    id: tripList,
                    title: trips[tripList].title,
                    origin: trips[tripList].origin,
                    destination: trips[tripList].destination
                })
            }
            this.setState({
                trips: newState 
            })
        });
    
    }

    // componentDidUpdate(prevProps) {
    //     if (this.state.trips != prevProps.trips) { 
            
    //         const tripRef = firebase.database().ref("trips");
    //         tripRef.on('value', (snapshot) => {
    //             let trips = snapshot.val();
    //             let newState = [];
    //             for (let tripList in trips) {
    //                 newState.push({
    //                     id: tripList,
    //                     title: trips[tripList].title,
    //                     origin: trips[tripList].origin,
    //                     destination: trips[tripList].destination
    //                 })
    //             }
    //             this.setState({
    //                 trips: newState
    //             })
    //         });
    //     }

    // }

    removeTrip = (e) => {
        console.log(e.target.id);
        const tripRef = firebase.database().ref(`/trips/${e.target.id}`);
        tripRef.remove();
    }


    render() {
        return (
            <div>
                <header>
                    <h1>All Trips!</h1>
                </header>
                <section className="mockInput">
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="tripName" placeholder="Trip Name" onChange={this.handleChange} value={this.state.tripName} />
                        <input type="text" name="startPoint" placeholder="Your Location" onChange={this.handleChange} value={this.state.startPoint}/>
                        <input type="text" name="endPoint" placeholder="Destination" onChange={this.handleChange} value={this.state.endPoint}/>
                        <button>Save Trip!</button>
                    </form>
                </section>
                <section>
                    <ul>
                        {this.state.trips.map(item => {
                            return <li key={item.id}>
                                <h3>
                                  {item.title}
                                </h3>
                                <p>
                                  Origin:{" "}
                                  {item.origin}
                                </p>
                                <p>
                                  Destination:{" "}
                                  {item.destination}
                                </p>
                                <button id={item.id} onClick={this.removeTrip}>
                                  Remove Trip!
                                </button>
                              </li>;
                        })}
                        {/* {Object.entries(this.state.trips).map((item, i) => {
                            return (
                                <li key={item.id}>
                                    <h3>{item[1].title}</h3>
                                    <p>Origin: {item[1].origin}</p>
                                    <p>Destination: {item[1].destination}</p>
                                    <button id={item.id} onClick={this.removeTrip}>Remove Trip!</button>
                                </li>
                            )
                        })} */}
                    </ul>
                </section>

            </div>
        )
    }

}


export default TripList;