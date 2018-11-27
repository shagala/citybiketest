import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Section from './Section'
import mark from './bike-parking.svg';
import './App.css'

//Icon for mark bikes
const myIcon = L.icon({
  iconUrl: mark,
  iconSize: [25, 41]
});

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
    //get data of the channel bikes
    socket.on('bikes', (data) => {
      this.setState({
          stations: data.network.stations,
          response: true
        });
    });
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <div className="map">
        <Section />
        <Map className="Map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.stations.map( (stations) => (
              <Marker
                  key = {stations.id}
                  position={[stations.latitude, stations.longitude]}
                  icon={myIcon}
                  className="pointer">
                  <Popup>
                    <b>Adress: </b> {stations.name} <br/> <b>Bikes Available: </b> {stations.free_bikes}
                  </Popup>
              </Marker>
            ))
          }
          
        </Map>
      </div>
    );
  }
}
export default App;
