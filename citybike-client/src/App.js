import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker,Popup } from "react-leaflet";
import userLocationURL from './location.svg';
import L from 'leaflet'



const Location = L.icon({
  iconUrl: userLocationURL,
  iconSize: [35,42]
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
      estaciones:  null
    };

  }

  

  componentDidMount() {
      const { endpoint } = this.state;
      const socket = socketIOClient(endpoint);
      socket.on("cityBici", data => {
        this.setState({ estaciones: data }); 
      });
    }

 
// Funcion que crea los marcadores
  crearMarker ()  {    
    var estacionesBici = []
      this.state.estaciones.network.stations.forEach(estacion => {
        var aux = ( 
             < Marker key = {estacion.id} position={[estacion.latitude, estacion.longitude]}
            icon={Location} >  
              <Popup>        
                <span> There are { estacion.free_bikes }  bicycles available  and  { estacion.empty_slots } empty places in : { estacion.extra.address}  </span>
              </Popup> 

            </Marker>
          
        );
        estacionesBici.push(aux);
        
      }) 

        return estacionesBici;
    }; 
        

  render() { 
    const position = [this.state.lat, this.state.lng]
    return (

      <div className="map">
         <h1 className='title'> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        { this.state.estaciones?this.crearMarker():null}  
        </Map> 
      </div>
    );
  }
}
export default App;
  