
const SERVER_URL = import.meta.env.VITE_SERVER_URL;


export const getPlaylistIds = async (playlistsJSONObject) => {
    const validPlaylists = playlistsJSONObject.playlists.items.filter(playlist => playlist !== null);
    
    const playlistIDs = validPlaylists.map(playlist => playlist.id);
    return playlistIDs
}

export const fetchPlaylistItems = async (playlistIds) => {
    let data = [];

    for (let i = 0; i < playlistIds.length; i++) {
        const response = await fetch(`${SERVER_URL}/api/v2/playlists/${playlistIds[i]}/tracks`,{
            method:"GET",
            credentials: "include",
        });

        if (response.ok) {
            const playlistData = await response.json(); 
            data.push(playlistData);
        } else {
            console.log("Error getting playlist items");
        }
    }
    return data;
}

export const getPlaylistTrackIds = async (playlistsJSONItemsObject) => {
    const trackIDs = playlistsJSONItemsObject.flatMap(playlist => 
        playlist.items?.map(item => item.track?.id).filter(id => id !== undefined) || [] // Filter undefined track IDs
    );
    return trackIDs;
}
