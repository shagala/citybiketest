import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { Map, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet';
import L from 'leaflet';

 //Custom icon for map marks
  const bikePoint = L.icon({
    iconUrl: require('./assets/bicycle.svg'),
    iconRetinaUrl: require('./assets/bicycle.svg'),
    iconSize: [25, 41]
  });

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4000',
      lat: 25.792913,
      lng: -80.141599,
      zoom: 14,
      bikesMiami: null,
    };
  }
  
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('bikesApi', data => {
      this.setState({ bikesMiami: data });
    });
  }

  //Explode each position and render the markers
  explodeMarkers = () => {
    if (this.state.bikesMiami) {
      var myMarkers = this.state.bikesMiami.network.stations.map(
        (marker, index) => {
          return (
            <div key={ `marker_container_${marker.id}` }>
              <Marker key={ `marker_${marker.id}` } position={[marker.latitude, marker.longitude]} icon={bikePoint}>
                <Popup>
                  <div><strong>{marker.extra.address}</strong></div>
                  <div>Free bikes: {marker.free_bikes}</div>
                </Popup>
              </Marker>
            </div>
          );
        },
      );
      return myMarkers;
    }
  };
  
  render() {
    const position = [this.state.lat, this.state.lng];
    var themiamidata = this.state.bikesMiami;

    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          //Show the markers dynamically
          if(themiamidata){
            this.explodeMarkers()
          }
        </Map>
      </div>
    );
  }
}
export default App;