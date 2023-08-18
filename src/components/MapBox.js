import React from "react";
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

function MapBox(props) {

  // MAPBOX
  mapboxgl.accessToken = 'pk.eyJ1Ijoia3M5NjYiLCJhIjoiY2xoNWFscWNoMjR4bTNmcDR4bDlxc251cyJ9.kBd-A7Q6c0xOrlcorDyE7w';
  
  const mapContainer = props.mapContainer
  const map = props.map
  const [lng, setLng] = useState(props.lng ? props.lng : -73.95628); // starting coordinate
  const [lat, setLat] = useState(props.lat ? props.lat : 40.75571);
  const [zoom, setZoom] = useState(13); // starting zoom
  
  // Initialize and add geocoding control to the map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add the control to the map.
    map.current.addControl(
      new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));
  });  

  // Track and update latitude / longitude on the map
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // Create default Markers and add it to the map.
  useEffect(() => {
    if (props.posts) {
      props.posts.forEach(post => {
        if (post.lng && post.lat) {
          const marker = new mapboxgl.Marker()
            .setLngLat([post.lng, post.lat])
            .addTo(map.current);        
        }  
      });
    }
  });

  return (
    <div id={props.id} ref={mapContainer} className="map-container h-full w-full" data-lat={lat} data-lng={lng} />
  );
};

export default MapBox