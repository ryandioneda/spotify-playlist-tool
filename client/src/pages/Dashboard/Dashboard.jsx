import { useState, useEffect } from "react";

import { fetchUserProfile } from "../../utils/ProfileUtil"
import { fetchSearchResults } from "../../utils/SearchUtil";
import { getPlaylistIds, fetchPlaylistItems, getPlaylistTrackIds} from "../../utils/PlaylistsUtil";
import { fetchTracks, createTracks } from "../../utils/TrackUtils";

import musicPNG from "../../assets/images/note-beam-blank.png";

import Footer from "../../components/Footer/Footer";

function Dashboard() {

    const [searchTerm, setSearchTerm] = useState("");
    const [userProfile, setUserProfile] = useState(null);


    useEffect(() => {
        const getUserProfile = async () => {
            const profileData = await fetchUserProfile();
            setUserProfile(profileData)
        };
    
        getUserProfile();

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const encodedSearchTerm = encodeURIComponent(searchTerm)
            console.log(encodedSearchTerm);
            // fetch api
            const playlistsJSONResponse = await fetchSearchResults(encodedSearchTerm);
            //console.log(`1ST RESPONSE: ${playlistsJSONResponse}`);
            console.log(playlistsJSONResponse);

            //parse
            const playlistIds = await getPlaylistIds(playlistsJSONResponse);
            console.log(`2ND RESPONSE: ${playlistIds}`);

            // fetch api
            const playlistsJSONItems = await fetchPlaylistItems(playlistIds);

            console.log(`3RD RESPONSE: ${playlistsJSONItems}`);

            // parse
            const playlistTrackIds = await getPlaylistTrackIds(playlistsJSONItems);
            console.log(`4TH RESPONSE: ${playlistTrackIds}`);

            const trackInformation = await fetchTracks(playlistTrackIds)
            console.log(trackInformation);
            const tracks = createTracks(trackInformation)

            


        } catch (error) {
            console.error("Error fetching search results:", error)
        }
    }

    return (
        <div className="h-screen grid grid-rows-6 bg-transparent md:grid-cols-6">

            {/* INFO CONTAINER */}
            <div className="bg-transparent row-span-3 grid grid-cols-2 grid-rows-12 md:col-span-3 md:row-span-5">

                 {/* IMAGE CONTAINER - COL 1*/}
                <div className="bg-blue-500 row-span-3 p-2 flex justify-center items-center">
                    <div className="bg-yellow-500 h-full w-full flex">
                         <img 
                         className="flex w-full h-full object-contain" 
                         src={musicPNG} />
                    </div>
                </div>

                {/* EXTRA INFO CONTAINER - COL 2 */}
                <div className="bg-pink-500 row-span-3 flex justify-start">
                    <div className="bg-green-500 flex flex-col gap-2 items-start p-2">
                        <div className="bg-purple-500">
                            <input
                                placeholder="Playlist Name"
                                className="w-full"
                            >
                            
                            </input>
                        </div>

                        <div className="bg-blue-500 flex w-full gap-2">
                            <div className="w-8 h-8 md:w-12 md:h-12 overflow-hidden bg-red-500">
                                <img
                                    src={userProfile?.profile_image || "default-profile.png"}
                                    className="w-full h-full object-cover rounded-full"
                                >

                                </img>
                            </div>

                            <div className="bg-yellow-500 flex justify-center items-center">
                                <p>{userProfile?.display_name || "User"}</p>

                            </div>
                            
                        </div>

                    </div>
                </div>

                {/* USER PLAYLIST TRACKS */}
                <div className="row-start-4 row-span-9 col-span-2 bg-green-700 p-2">
                    <div className="border-2 border-black bg-purple-500 flex w-full h-full">
                        HELLO

                    </div>

                </div>

            </div>

            {/* SEARCH CONTAINER */}
            <div className="bg-orange-500 row-span-2 p-2 grid-rows-2 md:col-span-3 md:row-span-5">
                <div className="border-2 border-black bg-white flex h-full w-full">
                    HELLO

                </div>

            </div>

            <div className="bg-blue-400 pt-2 flex pr-2 pl-2 md:row-start-6 md:col-span-6">
                <div className="bg-amber-100 flex flex-1">
                    <div>
                        <button
                            className="bg-red-500"     
                        >
                            Add Playlist
                        </button>
                    </div>
                </div>

                <div className="bg-purple-500 flex flex-1">
                    <form 
                        action=""
                        className=""
                        onSubmit={handleSubmit}
                    >
                        <input
                            placeholder="Search a movie"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        >
                        
                        </input>


                    </form>
                </div>
            </div>
                   

        </div>

    )
}

export default Dashboard;
