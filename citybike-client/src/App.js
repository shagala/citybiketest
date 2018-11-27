import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
const moment = require('moment');

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            response: [],
            endpoint: 'http://127.0.0.1:4001',
            lat: 25.82,
            lng: -80.19,
            zoom: 12
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on('connect', function() {
            console.log(`Connected to server`);
        });
        socket.on('MiamiStations', data =>
            this.setState({ response: data })
        );
    }

    render() {
        const response = this.state.response;
        const position = [this.state.lat, this.state.lng];
        return (
            <div className="map">
                <h1>City Bikes in Miami</h1>
                <Map center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
                        url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    { response.length === 0 ? <span id="loading">Loading...</span> : <Markers markers={response} /> }
                </Map>
            </div>
        );
    }
}

const Markers = ({ map, markers }) => {
    const items = markers.map(({ id, ...props }) => (
        <Popups map={map} key={id} {...props} />
    ));
    return <div style={{display: 'none'}}>{items}</div>;
};

const Popups = ({ map, free_bikes, id, latitude, longitude, name, timestamp }) => (
    <Marker map={map} position={[latitude, longitude]}>
        <Popup>
            <span>
                <b>{free_bikes} free bikes</b> <code>{moment(timestamp).format('HH:mm:ss[ hrs]')}</code>
                <br />
                {name} Station
            </span>
        </Popup>
    </Marker>
);

export default App;
