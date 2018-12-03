import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";



import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



var loc           = new Array();
const coordinates = [25.790654, -80.1300455];

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.790654,
      lng: -80.1300455,
      zoom: 13
    };
  }
  componentWillMount(){

    //function(data){
            //alert("inside componentWillMount");
            /*for(var i = 0; i < data.length; i++){
                //console.log(data[i]);
                var free_bikes = data[i]['free_bikes'];
                var latitude   = data[i]['latitude'];
                var longitude  = data[i]['longitude'];
                var name       = data[i]['name'];
                var dictionary = {
                  "free_bikes": free_bikes,
                  "latitude": latitude,
                  "longitude": longitude,
                  "name":name
                };
                array.push(dictionary);
            }
            console.log("array??");
            console.log(array);
            console.log(this);
            loc = array;*/

    //});

  }
  componentDidMount(){
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    //alert("Reading data from the server.");
    var array           = new Array();
    socket.on("messages", data =>this.setState({response: data})); 
  }
  /*componentDidMount() {
    const { endpoint }  = this.state;
    const socket        = socketIOClient(endpoint);
    var array           = new Array();
    alert("inside component did mount");
   socket.on("messages", function(data){
            alert("inside c");

            console.log("Mi data: ");
            console.log(data);

            /*for(var i = 0; i < data.length; i++){
            //console.log(data[i]);
            var free_bikes = data[i]['free_bikes'];
            var latitude   = data[i]['latitude'];
            var longitude  = data[i]['longitude'];
            var name       = data[i]['name'];
            var dictionary = {
              "free_bikes": free_bikes,
              "latitude": latitude,
              "longitude": longitude,
              "name":name
            };
            array.push(dictionary);*/
        //}
        //console.log("array??");
        //console.log(array);


    //});
    //socket.on("messages", function(data){
        //alert("mensaje del servidor");
        //console.log("data .length");
        //console.log(data.length);
        //for(var i = 0; i < data.length; i++){
            //console.log(data[i]);
            //var free_bikes = data[i]['free_bikes'];
            //var latitude   = data[i]['latitude'];
            //var longitude  = data[i]['longitude'];
            //var name       = data[i]['name'];
            //var dictionary = {
            //  "free_bikes": free_bikes,
            //  "latitude": latitude,
            //  "longitude": longitude,
            //  "name":name
            //};
            //array.push(dictionary);
        //}
        //console.log("array??");
        //console.log("Mi data: ");
        //console.log(data);

    //});

   
  //}*/


  renderMarkers(e) {
        console.log("response");
        console.log(Array.from(e));
        loc = Array.from(e);

        //alert("inside renderMarkers()");
        //console.log("Length of loc");
        //console.log(loc.length);  
          //alert("?");
          //console.log("loc1 datatype") 
          //console.log(typeof(loc1));
          /*for (var i = 0; i < response.length; i++){
            //console.log("POSICION");

            //console.log("the datapoint");
            //console.log(response[i]);
            //console.log(response[i].latitude);
            //console.log(response[i].longitude);
            //console.log(response[i].free_bikes);
            var myLatLng = {lat: 25, lng: -80};

            //console.log(response[i]);
            return <Marker
              key={ i }
              title = { response[i].free_bikes }
              position = { myLatLng }
              desc = { response[i].free_bikes } />
            
          }*/
          return loc.map((location, i) => {
              return <Marker
                title = { location['free_bikes'] }
                position = { {lat: location['latitude'], lng: location['longitude']} }
                />
            })          
  }
  render() {
    //alert("inside render");
    const { response } = this.state;
    const position = [this.state.lat, this.state.lng]
    //console.log("response");
    //console.log(response);


    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          { this.renderMarkers(response) }
        </Map>
      </div>
    );
  }
}
export default App;
