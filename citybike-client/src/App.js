import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import config from './config';

class App extends Component {
  state = {
    attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    lat: 25.761681,
    lng: -80.191788,    
    zoom: 13,
    dataMap : [],
  };
  
  componentDidMount() {         
    const socket = socketIOClient(config.apiEndPoint);
    socket.on('FromAPI', data => {
      this.setState({ dataMap: data });
    });
  }

  getMarkers = () => {
    const {dataMap} = this.state;
    return dataMap.map((value, index) =>{
      
      return (        
        <div key={index}>
          <CircleMarker
            center={[value.latitude, value.longitude]}
            color="#0099ff"
            radius={7}
          />
          <Marker key={index} position={[value.latitude, value.longitude]}>
            <Popup>
              Bikes free {value.free_bikes ? value.free_bikes : ''} <br />
              Slots free {value.empty_slots ? value.empty_slots : ''} <br />
              Address {value.extra && value.extra.address ? value.extra.address : ''}
            </Popup>
          </Marker>
        </div>  
      );
    })
  };

  render() {    
    const { lat, lng, zoom, dataMap, attribution } = this.state;
    const position = [lat, lng];
    const markers = dataMap.length > 0 ? this.getMarkers() : '';
  
    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={zoom}>
          <TileLayer
            attribution={attribution}
            url={config.mapUrl}
          />
          { markers }
        </Map>        
      </div>
    );
  }
}
export default App;
