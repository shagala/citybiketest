import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import './App.css'

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      stations: []
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    
    socket.on('location', (location) => {
      this.setState({
        lat: location.latitude,
        lng: location.longitude
      });
    });
    
    socket.on('stations', (stations) => {
      this.setState({
        stations: stations
      });
    });
  }

  renderMarkers() {
    return this.state.stations.map((station) => 
      <Marker key={station.id} position={[station.latitude, station.longitude]}>
        <Popup>
          <div> Address: { station.extra.address } </div>
          <div> Bikes availables: { station.free_bikes }</div>
          <div> Empty slots: { station.empty_slots }</div>
        </Popup>
      </Marker>
    );
  }

  render() {
    const { lat, lng, zoom } = this.state;

    return (
      <div className="map">
        <h1 className='title'> City Bikes in Miami </h1>
        <Map center={[lat, lng]} zoom={zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { this.renderMarkers() }
        </Map>
      </div>
    );
  }
}
export default App;
