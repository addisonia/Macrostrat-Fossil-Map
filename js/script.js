// Initialize the map
const map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch data from the Macrostrat API
fetch('https://macrostrat.org/api/fossils')
  .then(response => response.json())
  .then(data => {
    // Process the data and add markers to the map
    data.success.data.forEach(fossil => {
      const { lat, lng } = fossil;
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`
          <h3>${fossil.cltn_name}</h3>
          <p>Unit ID: ${fossil.unit_id}</p>
          <p>Column ID: ${fossil.col_id}</p>
        `);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });