import { useState, useEffect } from "react";

import { fetchUserProfile } from "../../utils/ProfileUtil"
import { fetchSearchResults } from "../../utils/SearchUtil";
import { getPlaylistIds, fetchPlaylistItems, getPlaylistTrackIds} from "../../utils/PlaylistsUtil";

function Dashboard() {

    const [searchTerm, setSearchTerm] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // fetch api
            const playlistsJSONResponse = await fetchSearchResults(searchTerm);

            //parse
            const playlistIds = await getPlaylistIds(playlistsJSONResponse);

            // fetch api
            const playlistsJSONItems = await fetchPlaylistItems(playlistIds);

            console.log(playlistsJSONItems);

            // parse
            const playlistTrackIds = await getPlaylistTrackIds(playlistsJSONItems);
            console.log(playlistTrackIds);


        } catch (error) {
            console.error("Error fetching search results:", error)
        }
    }


    return (
        <div>

            <button onClick={fetchUserProfile}>
                Tell me user!

            </button>

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Search a movie" 
                    className="" 
                    onChange={(e) => setSearchTerm(e.target.value)}
                >
                
                </input>
            </form>
        </div>
    )
}

export default Dashboard;
