import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

class App extends Component {
  constructor() {
    super();

    this.mapref = React.createRef();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
      stations: []
    };

  }

  // Funcion para crear los marcadores en el mapa.
  createMarkers () {

    let markers = []
    for (let j = 0; j < this.state.stations.length; j++) {
      markers.push(
        <Marker key={j} position={[this.state.stations[j]['latitude'], this.state.stations[j]['longitude']]}>
          <Popup>
            <span> There are -{ this.state.stations[j]['free_bikes'] }- bikes availables at : { this.state.stations[j]['name'] }  </span>
          </Popup>
        </Marker>
      )
    }
    return markers;
  }


  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('location', function (location) {
      this.setState({
        lat: location['latitude'],
        lng: location['longitude']
      });
    }.bind(this));


    socket.on('stations', function (stations) {
      this.setState({
        stations: stations
      });
    }.bind(this));

  }


  render() {
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng]

    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom} ref={this.mapref}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.createMarkers()}
        </Map>
      </div>
    );
  }
}
export default App;

