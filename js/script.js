// Initialize the map
const map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch data from the PBDB API
fetch('https://paleobiodb.org/data1.2/occs/list.json?interval=Permian&show=coords,loc')
  .then(response => response.json())
  .then(data => {
    console.log('API response:', data);
    
    // Check if data.records exists and is an array
    if (data.records && Array.isArray(data.records)) {
      // Process the data and add markers to the map
      data.records.forEach(occurrence => {
        const { lat, lng } = occurrence;
        
        if (lat && lng) {
          L.marker([lat, lng]).addTo(map)
            .bindPopup(`
              <h3>${occurrence.collection_name}</h3>
              <p>Occurrence ID: ${occurrence.occurrence_no}</p>
              <p>Taxon: ${occurrence.identified_name}</p>
            `);
        }
      });
    } else {
      console.error('Invalid API response format');
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });