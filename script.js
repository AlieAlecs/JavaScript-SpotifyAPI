async function searchSpotify() {
  const searchTerm = document.getElementById('search-input').value;

  try {
    // Use your own Spotify Client ID and Secret ID here
    const clientId = '13300044edd545b5bd305218475161d5';
    const clientSecret = '4c3a00d0c3864a5c8d77db26e3a20080';

    // Get access token using Client Credentials Flow
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();

    // Use the obtained access token to make the search request
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    });

    const searchData = await searchResponse.json();
    displayResults(searchData.tracks.items, 'results-body');

    if (searchData.tracks.items.length > 0) {
      const seedTrackId = searchData.tracks.items[0].id; // Use the first track as a seed
      
      // Get recommended tracks based on the seed track
      const recommendationsResponse = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrackId}`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      const recommendedTracks = await recommendationsResponse.json();
      displayResults(recommendedTracks.tracks, 'recommendations-body');
    } else {
      console.error('No search results found.');
    }
  } catch (error) {
    console.error('Error searching Spotify API:', error);
  }
}

function displayResults(tracks, tableBodyId) {
  const resultsBody = document.getElementById(tableBodyId);
  resultsBody.innerHTML = '';

  tracks.forEach(track => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${track.name}</td>
      <td>${track.artists.map(artist => artist.name).join(', ')}</td>
      <td>${track.album.name}</td>
      <td><img src="${track.album.images[0].url}" alt="${track.name}"></td>
      <td><button class="go-to-track-button" onclick="redirectToTrack('${track.external_urls.spotify}')">Go to Track</button></td>
    `;
    resultsBody.appendChild(row);
  });
}

function redirectToTrack(trackUrl) {
  window.location.href = trackUrl;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchSpotify();
  }
}
function updateDisplayCount() {
  searchSpotify();
}
  function toggleLike(button) {
    button.classList.toggle('liked');
}