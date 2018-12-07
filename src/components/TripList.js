import React, { Component } from "react";
import firebase from "../firebase.js";


class TripList extends Component {
    constructor() {
        super();
        this.state = {
            tripName: "",
            startPoint: "",
            endPoint: "",
            trips: {},
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
            this.setState({
                trips: snapshot.val()  
            })
        });
    
    }

    removeItem(tripsId) {
        const tripRef = firebase.database().ref(`/trips/${tripsId}`);
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
                        {Object.entries(this.state.trips).map((tripList) => {
                            return (
                                <li key={tripList.id}>
                                    <h3>{tripList[1].title}</h3>
                                    <p>Origin: {tripList[1].origin}</p>
                                    <p>Destination: {tripList[1].destination}</p>
                                    <button onClick={() => this.removeItem(tripList.title)}>Remove Trip!</button>
                                </li>
                            )
                        })}
                    </ul>
                </section>

            </div>
        )
    }

}


export default TripList;