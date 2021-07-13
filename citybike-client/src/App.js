import React, {useState, useEffect} from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup,  } from "react-leaflet";

const endpoint = "http://127.0.0.1:4001";
const miamiPosition = {
  lat: 25.761681,
  lng: -80.191788
}
const zoom = 13;


const StationUI = (props) => {
  return(
    <Marker key={props.station.id} position={{lat: props.station.lat, lng: props.station.long}} title={props.station.name}>
      <Popup>
        <div className="Station-UI">
          <div>
            <div>
              {props.station.name}
            </div>
            <div>
              {props.station.id}     
            </div>
          </div>
          <div>
            <div>
              Free bikes: {props.station.free_bikes}
            </div>
            <div>
              <button disabled={props.station.free_bikes === 0} onClick={() => props.callback({...props.station, free_bikes: props.station.free_bikes - 1, empty_slots: props.station.empty_slots + 1})}>Tomar Bicicleta</button>                 
            </div>
          </div>
          <div>
            <div>
              Empty Slots: {props.station.empty_slots}
            </div>
            <div>
              <button disabled={props.station.empty_slots === 0} onClick={() => props.callback({...props.station, free_bikes: props.station.free_bikes + 1,  empty_slots: props.station.empty_slots - 1})}>Retornar Bicicleta</button>                 
            </div>
          </div>
          <div>
            <div>
              Esta Dañada: {props.station.is_damaged ? 'SI' : 'NO'}
            </div>
            <div>
              <button onClick={() => props.callback({...props.station, is_damaged: !props.station.is_damaged})}>{props.station.is_damaged ? 'Reportar buen estado' : 'Reportar mal estado'}</button>            
            </div>
          </div>
        </div> 
      </Popup> 
    </Marker> 
  )
}

function App() {
  
  const [stations, setStations] = useState([]);
  const [socketStarted, setSocketStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  
  
  useEffect(() => {
    if(socketStarted === false){
      setSocket(socketIOClient(endpoint));
      setSocketStarted(true);
    }
  }, [socketStarted]);
  
  useEffect(() => {
    if(socketStarted === true && socket !== undefined){
      socket.on('initialData', stationsData => { 
        console.log('hola')
        console.log(stationsData)
        setStations(stationsData);
      });

      socket.on('updateData', stationsData => {
        setStations(stationsData);
      });
    }
  });

  const updateStation = (station) => {
    if(socketStarted && socket !== undefined){
      socket.emit('updateStation', station );
    }
  }
    
  return (

    <div className="map">
      <h1> City Bikes in Miami </h1>
      <Map center={miamiPosition} zoom={zoom}>
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {
          stations.map(x => <StationUI key={x.id} station={x} callback={updateStation} /> )
        }
      </Map>
    </div>
  );

}

export default App;