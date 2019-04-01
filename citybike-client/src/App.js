import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends Component {
  constructor(props) {
     super(props);

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4000",
      lat: 25.761681,
      lng: -80.191788,
      zoom: 13
    };
  }
componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

render() {
    const position = [this.state.lat, this.state.lng]
    //console.table(this.state.response);
    //console.log(this.state.response);
    var markers = [];
    for (var i = 0; i < this.state.response.length; i++) {
      markers.push(
        <Marker key={[this.state.response[i].id]} position={[this.state.response[i].latitude, this.state.response[i].longitude]}>
          <Popup>
            <div>
            <span>
              Address : <strong>{[this.state.response[i].name]}</strong>
            </span>
            </div>
             <div>
            <span>
              Free Bikes : <strong>{[this.state.response[i].free_bikes]}</strong>
            </span>
            </div>
          </Popup>
        </Marker>
        )
    }
    
    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
              <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers}
      
      </Map>
      </div>
    );
  }
}
export default App;
