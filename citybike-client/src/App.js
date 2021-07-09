import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { imageOverlay } from "leaflet";

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001/",
      lat: 25.797651558015108,
      lng: -80.16283456162486,
      zoom: 13,
      stations:[]
    };

  }
  
  componentDidMount() {
    const self= this
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("citybike", function(data){
      const result = JSON.parse(data)
      self.setState({stations: result.network.stations})
    })

   
  }
  render() {
    const { stations } = this.state;
    const position = [this.state.lat, this.state.lng]
    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
          {console.log(stations)}
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            stations.length > 0 && stations.map((station)=>(
              <Marker key={station.id} position={[station.latitude, station.longitude]}>
                {console.log(station)}
                <Popup>
                  <h2>{station.name}</h2>
                  <h3>Empty slots: {station.empty_slots}</h3>
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
