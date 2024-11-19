
    mapboxgl.accessToken = mapToken ;
    console.log(coordinates.split(","));
   const map = new mapboxgl.Map({
   container: 'map', // container ID
  style:"mapbox://styles/mapbox/streets-v12",
  center: coordinates.split(","), // starting position [lng, lat]. Note that lat must be set between -90 and 90
 zoom: 9 // starting zoom
  });


  const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates.split(","))
        .setPopup( new mapboxgl.Popup({offset:25 ,closeButton: false,
            closeOnClick: false})  
        .setHTML(`<h3>${listing}</h3><p>Exact location will be provided after booking</p>`)) 
        .addTo(map);

        

        map.on('mouseenter', 'places', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // popup.setLngLat(coordinates.split(",")).setHTML(`<h3>${listing}</h3><p>Exact location will be provided after booking</p>`).addTo(map);
        });
            map.on('mouseleave', 'places', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });