import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  CircleMarker,
} from 'react-leaflet';

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4001',
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      dataMiami: null,
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('FromAPI', data => {
      this.setState({ dataMiami: data });
    });
  }
  renderMarker = () => {
    if (this.state.dataMiami) {
      var componentCircle = this.state.dataMiami.network.stations.map(
        (value, index) => {
          return (
            <div key={index}>
              <CircleMarker
                center={[value.latitude, value.longitude]}
                color="blue"
                radius={20}
              />
              <Marker key={index} position={[value.latitude, value.longitude]}>
                <Popup>
                  Bikes free {value.free_bikes} <br />
                  Slots free {value.empty_slots} <br />
                  Address {value.extra.address}
                </Popup>
              </Marker>
            </div>
          );
        },
      );
      return componentCircle;
    }
  };
  render() {
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.dataMiami ? this.renderMarker() : null}
        </Map>
      </div>
    );
  }
}
export default App;
