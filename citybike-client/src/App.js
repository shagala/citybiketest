import React, {
  Component
} from 'react';
import {
  Map,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: 'http://127.0.0.1:4001',
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13,
      dataApi: null,
    };
  }
  componentDidMount() {
    const {
      endpoint
    } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('socketApi', data => {
      this.setState({
        dataApi: data
      });
    });
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    return nextState.dataApi!==this.state.dataApi;
  }
  render() {
    const position = [this.state.lat, this.state.lng];
    let markers=null;
    if(this.state.dataApi){
      markers=this.state.dataApi.network.stations.map(item=>{
         const positionMarker=[item.latitude,item.longitude]
         return (
          <Marker key={item.id} position={positionMarker}>
            <Popup>
             {item.extra.address}
            </Popup>
          </Marker>
         )
      }) 
    }
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </Map>
    )
  }
}
export default App;
