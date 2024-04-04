// Initialize the map centered on Wisconsin
const map = L.map('map').setView([44.5, -89.5], 6);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch data from the PBDB API
fetch('https://paleobiodb.org/data1.2/occs/list.json?state=Wisconsin&show=coords,loc,coll,strat,stratext,lith')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('PBDB API response:', data);

    // Check if data.records exists and is an array
    if (data.records && Array.isArray(data.records)) {
      // Process the data and add markers to the map
      data.records.forEach(occurrence => {
        const { lat, lng } = occurrence;
        if (lat && lng) {
          // Fetch additional details from the Macrostrat API
          fetch(`https://macrostrat.org/api/units?lat=${lat}&lng=${lng}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(macrostratData => {
              console.log('Macrostrat API response:', macrostratData);

            // Extract relevant information from the Macrostrat API response
            const unit = macrostratData.success.data[0];
            console.log('Unit data:', unit);

            const unitName = unit ? unit.unit_name || 'Unknown' : 'Unknown';
            const unitID = unit ? unit.unit_id || 'Unkown' : 'Unknown';
            const formation = unit ? unit.Fm || unit.unit_name || 'Unknown' : 'Unknown';
            const group = unit ? unit.Gp || 'Unknown' : 'Unknown';
            const columnArea = unit ? unit.col_area || 'Unknown' : 'Unknown';
            const minThickness = unit ? unit.min_thick || 'Unknown' : 'Unknown';
            const maxThickness = unit ? unit.max_thick || 'Unknown' : 'Unknown';
            const geologicAge = unit && unit.b_age && unit.t_age ? `${unit.b_age} - ${unit.t_age} Ma` : 'Unknown';

            // Create the marker with the popup content
            L.marker([lat, lng]).addTo(map)
            .bindPopup(`
                <h3>${unitName}</h3>
                <p><strong>Unit ID:</strong> ${unitID}</p>
                <p><strong>Formation:</strong> ${formation}</p>
                <p><strong>Group:</strong> ${group}</p>
                <p><strong>Column Area:</strong> ${columnArea}</p>
                <p><strong>Min Thickness:</strong> ${minThickness} m</p>
                <p><strong>Max Thickness:</strong> ${maxThickness} m</p>
                <p><strong>Geologic Age:</strong> ${geologicAge}</p>
            `);
            })
            .catch(error => {
              console.error('Error fetching Macrostrat data:', error);
            });
        }
      });
    } else {
      console.error('Invalid PBDB API response format');
    }
  })
  .catch(error => {
    console.error('Error fetching PBDB data:', error);
  });