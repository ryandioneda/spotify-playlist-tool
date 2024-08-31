/* FOR HAMBURGER MENU */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

// Toggle hamburger menu visibility on click
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close hamburger menu when any nav item is clicked
document.querySelectorAll(".nav-item").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));



//function to create track item
function createTrackItem(track, index, isInPlaylist = false) {
    const trackItem = document.createElement('div');
    trackItem.classList.add('track-item');
    trackItem.dataset.id = track.id; // Set the track ID for retrieval

    const albumImageUrl = track.album.images.length > 0 ? track.album.images[0].url : 'default-image.jpg';
    const previewUrl = track.preview_url ? track.preview_url : '';

    trackItem.innerHTML = `
    <div class="track-number-container">
        <div class="track-number">${index + 1}</div>
        <div class="loader">
            <div class="loading">
                <div class="load"></div>
                <div class="load"></div>
                <div class="load"></div>
            </div>
        </div>
    </div>
    <div class="button-container">
        <div class="play-button">
            <i class="fa fa-play"></i>
        </div>
        <div class="pause-button" style="display: none;">
            <i class="fa fa-pause"></i>
        </div>
    </div>
    <img src="${albumImageUrl}" alt="${track.name}">
    <div class="track-info">
        <h1>${track.name}</h1>
        <p>${track.artists.map(artist => artist.name).join(', ')}</p>
        ${previewUrl ? `<audio src="${previewUrl}" style="display: none;"></audio>` : '<p>No preview available</p>'}
    </div>
    <div class="${isInPlaylist ? 'minus-button' : 'plus-button'}">
        <i class="fa ${isInPlaylist ? 'fa-minus' : 'fa-plus'}"></i>
    </div>
`;


    // Add event listeners for play and pause buttons
    const playButton = trackItem.querySelector('.play-button');
    const pauseButton = trackItem.querySelector('.pause-button');
    const plusButton = trackItem.querySelector('.plus-button');
    const minusButton = trackItem.querySelector('.minus-button');
    const audioElement = trackItem.querySelector('audio');
    const loader = trackItem.querySelector('.loader');
    const trackNumber = trackItem.querySelector('.track-number');

    // Play button event
    playButton.addEventListener('click', () => {
        document.querySelectorAll('audio').forEach(audio => {
            if (audio !== audioElement) {
                const siblingTrackItem = audio.closest('.track-item');
                audio.pause();
                siblingTrackItem.classList.remove('active');
                siblingTrackItem.querySelector('.pause-button').style.display = 'none';
                siblingTrackItem.querySelector('.play-button').style.display = 'block';
                siblingTrackItem.querySelector('.loader').style.display = 'none'; // Hide loader for other tracks
                siblingTrackItem.querySelector('.track-number').classList.remove('hidden'); // Show track number for other tracks
            }
        });

        audioElement.play();
        trackItem.classList.add('active');
        playButton.style.display = 'none';
        pauseButton.style.display = 'none'; // Hide pause button initially
        loader.style.display = 'flex'; // Show loader
        trackNumber.classList.add('hidden'); // Hide track number
    });

    // Pause button event
    pauseButton.addEventListener('click', () => {
        audioElement.pause();
        trackItem.classList.remove('active');
        pauseButton.style.display = 'none';
        playButton.style.display = 'block';
        loader.style.display = 'none'; // Hide loader when paused
        trackNumber.classList.remove('hidden'); // Show track number
    });

    // Track item hover events
    trackItem.addEventListener('mouseenter', () => {
        if (trackItem.classList.contains('active')) {
            loader.style.display = 'none'; // Hide loader on hover if active
            pauseButton.style.display = 'block'; // Show pause button on hover if active
        } else {
            playButton.style.opacity = '1'; // Show play button on hover
        }
        trackNumber.style.opacity = '0'; // Hide track number on hover
    });

    trackItem.addEventListener('mouseleave', () => {
        if (trackItem.classList.contains('active')) {
            loader.style.display = 'flex'; // Show loader when not hovered
            pauseButton.style.display = 'none'; // Hide pause button when not hovered
        } else {
            playButton.style.opacity = '0'; // Hide play button when not hovered
        }
        trackNumber.style.opacity = '1'; // Show track number when not hovered
    });

    // Plus button event (add to playlist)
    if (plusButton) {
        plusButton.addEventListener('click', () => {
            addTrackToPlaylist(track);
            plusButton.classList.add('hidden'); // Hide plus button after adding track
        });
    }

    // Minus button event (remove from playlist)
    if (minusButton) {
        minusButton.addEventListener('click', () => {
            removeTrackFromPlaylist(track);
            if (plusButton) {
                plusButton.classList.remove('hidden'); // Show plus button after removing track
            }
            if (minusButton) {
                minusButton.classList.add('hidden'); // Hide minus button after removing track
            }
        });
    }

    return trackItem;
}



//! FUNCTION TO FETCH MOVIE DETAILS
async function fetchMovieDetails(searchRequest) {
    
    const response = await fetch(`/omdb/movie_details?title=${encodeURIComponent(searchRequest)}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


//! FUNCTION TO RENDER SEARCHED MOVIE POSTER
function renderMoviePoster(movieDetails) {
    let posterUrl;
    const posterContainer = document.getElementById('movie-image-container');

    if(movieDetails.Poster !== 'N/A') {
        
        posterUrl = movieDetails.Poster
    } else {
        
        posterUrl = '../static/images/note-beam.png';
    }
    



    posterContainer.innerHTML = `
        <img src="${posterUrl}" style="width: 100%; height: 100%;">
    `;
}

//! FUNCTION TO FETCH RELATED PLAYLISTS TO SEARCHED MOVIE ON SPOTIFY
async function fetchRelatedPlaylists(movieTitle) {
    
    const response = await fetch(`/spotify/search_related_playlists?movie_title=${encodeURIComponent(movieTitle)}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchSong(songTitle) {
    const response = await fetch(`/spotify/search_track?song_title=${encodeURIComponent(songTitle)}`);
    if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

//! FUNCTION TO EXTRACT PLAYLIST IDs
function extractPlaylistID(playlists) {
    if (!Array.isArray(playlists) || playlists.length === 0) {
        
        return [];
    }
    return playlists.map(playlist => playlist.id);
}

//! FUNCTION TO FETCH A PLAYLIST'S SONG IDs
async function fetchPlaylistSongIDS(playlistIDs) {
    const fetchSinglePlaylist = async (playlistID) => {
        //gets the first 5 songs
        
        const response = await fetch(`/spotify/get_playlist_songIDs?playlist_ID=${encodeURIComponent(playlistID)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    // Fetch songs for each playlist
    const fetchPromises = playlistIDs.map(id => fetchSinglePlaylist(id));
    return Promise.all(fetchPromises);
}

//! FUNCTION TO FETCH TRACK DETAILS
async function fetchTrackDetails(trackIDs) {
    const idsParam = trackIDs.join(',');
    const response = await fetch(`/spotify/get_tracks?track_ids=${encodeURIComponent(idsParam)}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.error) {
        throw new Error(`API error: ${result.error}`);
    }
    return result.tracks;
}


const renderedTrackIDs = new Set();

//! FUNCTION TO RENDER TRACKS
function renderTracks(tracks) {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = ''; // Clear any existing content

    // Render each track in the track list
    tracks.forEach((track, index) => {
        if(renderedTrackIDs.has(track.id)) {
            
            return;
        }
        renderedTrackIDs.add(track.id);

        const trackItem = createTrackItem(track, index);
        trackList.appendChild(trackItem);
    });
}

//! FUNCTION TO ADD TRACKS TO YOUR TRACK LIST
function addTrackToPlaylist(track) {
    
    const playlist = document.getElementById('your-track-list');
    const trackIndex = playlist.children.length;
    const trackItem = createTrackItem(track, trackIndex, true);
    playlist.appendChild(trackItem);
    trackItem.classList.remove('hidden'); // Ensure the track item is visible
    updateTrackCount(); // Update track count
}


//! FUNCTION TO REMOVE TRACKS FROM YOUR TRACK LIST
function removeTrackFromPlaylist(track) {
    
    const playlist = document.getElementById('your-track-list');
    const trackItems = playlist.querySelectorAll('.track-item');
    trackItems.forEach((item) => {
        const trackName = item.querySelector('.track-info h1').textContent;
        if (trackName === track.name) {
            item.remove(); // Remove track from playlist
            updateTrackCount(); // Update track count

            // Update track numbers for remaining tracks
            const remainingTracks = playlist.querySelectorAll('.track-item');
            remainingTracks.forEach((remainingItem, remainingIndex) => {
                const trackNumber = remainingItem.querySelector('.track-number');
                trackNumber.textContent = remainingIndex + 1;
            });
        }
    });

    // Update search results to show plus button again for removed track
    const searchResults = document.getElementById('track-list');
    const trackItemsInSearch = searchResults.querySelectorAll('.track-item');
    trackItemsInSearch.forEach(item => {
        const trackName = item.querySelector('.track-info h1').textContent;
        if (trackName === track.name) {
            const plusButton = item.querySelector('.plus-button');
            const minusButton = item.querySelector('.minus-button');
            plusButton.classList.remove('hidden'); // Show plus button
            if (minusButton) {
                minusButton.classList.add('hidden'); // Hide minus button if it exists
            }
        }
    });
}


//! FUNCTION TO UPDATE TRACK COUNT
function updateTrackCount() {
    const playlistSection = document.getElementById('your-track-list');
    const trackItems = playlistSection.querySelectorAll('.track-item');
    const trackCount = trackItems.length;
    const trackCountElement = document.getElementById('track-count');
    trackCountElement.textContent = trackCount;

    // Update track numbers
    trackItems.forEach((item, index) => {
        const trackNumber = item.querySelector('.track-number');
        trackNumber.textContent = index + 1;
    });
}

//! FUNCTION TO RETRIEVE TRACKS FROM YOUR TRACK LIST
function retrieveTrackList() {
    const playlistSection = document.getElementById('your-track-list');
    const trackItems = playlistSection.querySelectorAll('.track-item');
    const trackIDs = [];

    trackItems.forEach(trackItem => {
        const trackID = trackItem.dataset.id; // Use dataset.id to retrieve the track ID
        
        if (trackID) {
            trackIDs.push(trackID);
        }
    });

    return trackIDs;
}

//need function to retrieve input for playlist name
function retrievePlaylistName() {
    const playlistNameID = document.getElementById('playlist-name');
    let playlistName = playlistNameID.value.trim();

    if(playlistName === ""){
        playlistName = "My MovieFy Playlist"

    }
    return playlistName;
    



}


//! FUNCTION TO ADD PLAYLIST TO LIBRARY
function createPlaylist() {
    
    const trackIDs = retrieveTrackList();
    
    const playlistName = retrievePlaylistName();
    

    fetch('/spotify/add_playlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            track_ids: trackIDs,
            playlist_name: playlistName
        })
    })
    .then(response => {
        
        if (!response.ok) {
            return response.json().then(error => { throw new Error(error.error); });
        }
        return response.json();
    })
    .then(data => {
        
        const createButton = document.querySelector('.create-playlist-button');
        if (createButton) {
            createButton.textContent = 'Playlist Added!';
            createButton.disabled = true; // Optionally disable the button after success
            createButton.classList.add('active');
            console.log(createButton.classList)


            setTimeout(function() {
                createButton.classList.remove('active');
                createButton.textContent = 'Add to My Spotify Library';
                createButton.disabled = false;
            }, 5000); // 5000 milliseconds = 5 seconds
        }
        
    })
    .catch(error => {
        console.error('Error adding playlist items:', error);
        
    });
}

//! FUNCTION TO DISPLAY LOADER EFFECT
function toggleLoaderAndPauseButton(trackItem, action) {
    const loader = trackItem.querySelector('.loading');
    const pauseButton = trackItem.querySelector('.pause-button');

    if (action === 'showLoader') {
        loader.style.display = 'flex';
        pauseButton.style.display = 'none';
    } else if (action === 'showPauseButton') {
        loader.style.display = 'none';
        pauseButton.style.display = 'block';
    }
}


// Function to display the loader effect and handle track playback
function handleTrackPlayback(trackItem) {
    const playButton = trackItem.querySelector('.play-button');
    const pauseButton = trackItem.querySelector('.pause-button');

    playButton.addEventListener('click', () => {
        toggleLoaderAndPauseButton(trackItem, 'showLoader');
        // Add logic to play the track
        // Once the track starts playing, call toggleLoaderAndPauseButton with 'showPauseButton'
        setTimeout(() => {
            toggleLoaderAndPauseButton(trackItem, 'showPauseButton');
        }, 2000); // Simulating a delay for demonstration purposes (replace with actual track playback logic)
    });

    pauseButton.addEventListener('click', () => {
        // Add logic to pause the track
        // Call toggleLoaderAndPauseButton with 'showPauseButton' immediately
        toggleLoaderAndPauseButton(trackItem, 'showPauseButton');
    });
}


async function fetchSimilarMusic(trackIDs) {
    try {
        const response = await fetch(`/spotify/similar_tracks?track_ids=${encodeURIComponent(trackIDs.join(','))}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch(error){
        console.error('Error fetching similar music:', error);
        return [];
    }
}



async function refreshMusic() {
    const currentTrackIDs = retrieveTrackList();
    

    if(currentTrackIDs.length === 0){
        
        return;
    }

    //fetchSimilarMusic returns a json
    const recommendations = await fetchSimilarMusic(currentTrackIDs);

    const similarTracks = recommendations.tracks || []; // Ensure `similarTracks` accesses `tracks` key

    if(similarTracks.length > 0){
        renderTracks(similarTracks);

    } else {
        console.log('No similar tracks found');
    }
    

}




//! FOR REFRESH BUTTON
document.addEventListener('DOMContentLoaded', function() {
    const refreshButton = document.getElementById('refresh-button');
    if(refreshButton){
        refreshButton.addEventListener('click', refreshMusic);
    } else {
        console.error('Refresh button not found');
    }   
});


// Event listener for displaying the loader effect and handling track playback
document.addEventListener('DOMContentLoaded', function() {
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach(trackItem => {
        handleTrackPlayback(trackItem);
    });
});





// Event listener for creating playlist
document.addEventListener('DOMContentLoaded', function() {
    const createButton = document.querySelector('.create-playlist-button');
    if (createButton) {
        createButton.addEventListener('click', function() {
            createPlaylist();
        });
    } else {
        console.error('Create playlist button not found');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search__button');
    searchButton.addEventListener('click', async () => {
        const songTitle = document.querySelector('.search__input').value;
        try { //!CHANGED SEARCH SONG ROUTE NAME TO SEARCH TRACK
            //! CHANGE THIS TO ITS HELPER FUNCTION
            const response = await fetch(`/spotify/search_track?song_title=${encodeURIComponent(songTitle)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.track_ids && data.track_ids.length > 0) {
                const trackDetails = await fetchTrackDetails(data.track_ids);
                renderTracks(trackDetails);
            } else {
                displayError('No tracks found.');
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            displayError('Failed to fetch songs. Please try again.');
        }
    });
});


   














// Event listener for search form submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const loaderEffect = document.getElementById('loader-effect');
    

    // Create and append the track count element
    const playlistSection = document.querySelector('.section-your-playlist');
    const trackCountElement = document.createElement('div');
    trackCountElement.id = 'track-count';
    playlistSection.appendChild(trackCountElement);

    // Handle search form submission
    async function handleSearch(event) {
        event.preventDefault();
        const searchRequest = searchInput.value.trim();
        if (searchRequest === "") return;

        
        renderedTrackIDs.clear();
        const trackList = document.getElementById('track-list')
        trackList.innerHTML = '';

        try {
            // searchForm.classList.add('active'); //! SEARCH FORM STUFF
            // searchInput.style.display = 'block';
            searchInput.value = searchRequest;
            

            
            loaderEffect.style.display = 'block';
            

            const [movieDetails, playlistData] = await Promise.all([
                
                fetchMovieDetails(searchRequest), 
                fetchRelatedPlaylists(searchRequest) 
            ]);

            // Handle movie details
            if (movieDetails.error) {
                console.error('Error:', movieDetails.error);
                alert(`Error: ${movieDetails.error}`); 
                return;
            }
            renderMoviePoster(movieDetails); 

            // Handle related playlists
            if (playlistData.error) {
                console.error('Error:', playlistData.error);
                alert(`Error: ${playlistData.error}`);
                return;
            }
            
           
            const extractedPlaylistIDs = extractPlaylistID(playlistData);
            
            if (extractedPlaylistIDs.length > 0) {
                
                const allPlaylistsItems = await fetchPlaylistSongIDS(extractedPlaylistIDs.slice(0, 5)); // Limit to first 5 playlists for performance
                const trackIDs = allPlaylistsItems.flatMap(playlist => playlist.track_ids);
                if (trackIDs.length > 0) {
                    
                    const trackDetails = await fetchTrackDetails(trackIDs);
                    
                    renderTracks(trackDetails);
                } else {
                    
                }
            } else {
                console.log('No playlist IDs found');
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error: ${error.message}`);
        } finally {
            loaderEffect.style.display = "none";
        }
    }

    // Event listeners for search form
    searchForm.addEventListener('submit', handleSearch);
    searchIcon.addEventListener('click', handleSearch);
});