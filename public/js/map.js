if (listing && listing.geometry && listing.geometry.coordinates) {
    const coordinates = listing.geometry.coordinates;
    console.log(coordinates);  
}
mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://style/mapbox/streets-v12",
        
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom:10 // starting zoom
    });
    map.on('error', function(e) {
        console.error('Map error:', e);
    })

// const marker = new mapboxgl.Marker({ color: 'red' })
// .setLngLat(listing.geometry.coordinates)
// .setPopup(new mapboxgl.Popup({offset:25}))
// .setHTML(`<h5>${listing.location} , </h5><p>Exact Location provided after booking!</p>`)
// .addTo(map);

const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates) // Set marker position
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${listing.title}</h5><p>Exact Location provided after booking!</p>`)) // Add a popup with an offset
    .addTo(map); // Add marker to the map
