// Dependencias
import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup, CircleMarker, Circle } from "react-leaflet";

// Aplicacion
class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 12.5,
      estaciones: null
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    try {
      const socket = socketIOClient(endpoint); // establece conexion con el servidor
      socket.on('mensaje', (data) => {
        this.setState({
          estaciones : data, // el evento 'mensaje' es capturado al conectarse
        })
      });
    }
    catch (error) {
      console.error(`Errorrrrrrrr client: ${error.code}`);
    }
  }

  // Funcion para renderizar los datos de disponibilidad
  obtenerMarkers = () => {
    var stations_bikes = this.state.estaciones.network.stations.map( //mapeamos el div para cada estacion
      (station) =>{
        return (
          <div className="map2">
            <Circle center={[station.latitude, station.longitude]} color="blue" radius={3}/>
            <CircleMarker center={[station.latitude, station.longitude]} color="orange" radius={8}>
            </CircleMarker>   
            <Marker key={station.id} position={[station.latitude, station.longitude]}>
              <Popup>
                <b> Nombre: </b> {station.name ? station.name : ''} <br/>
                <b> Direccion:</b> {station.extra.address ? station.extra.address : ''} <br/>
                <b> Puestos vacios: </b>{station.empty_slots ? station.empty_slots : ''} <br/>
                <b> Bicicletas libres: </b>{station.free_bikes ? station.free_bikes : ''} <br/>
              </Popup>
            </Marker>
          </div>
        );
      });
    return stations_bikes;
  };

  render() {
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng];

    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          {this.state.estaciones ? this.obtenerMarkers() : null}
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}
export default App;
