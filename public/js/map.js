// let mapToken =mapToken;
// console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)     //listing.geometry.coordinates
    .setPopup(
        new mapboxgl.Popup({offset:25}).setHTML("<p>Exact location will be provided</p>") 
    )
    .addTo(map)
