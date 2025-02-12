import { useState, useEffect } from "react";

import { fetchUserProfile } from "../../utils/ProfileUtil"
import { fetchSearchResults } from "../../utils/SearchUtil";
import { getPlaylistIds, fetchPlaylistItems, getPlaylistTrackIds} from "../../utils/PlaylistsUtil";
import { fetchTracks, createTracks } from "../../utils/TrackUtils";

import musicPNG from "../../assets/images/note-beam-blank.png";

import Footer from "../../components/Footer/Footer";
import TrackList from "../../components/TrackList/TrackList";
import UserTrackList from "../../components/UserTrackList/UserTrackList";

function Dashboard() {

    const [searchTerm, setSearchTerm] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [userTracks, setUserTracks] = useState([]);


    useEffect(() => {
        const getUserProfile = async () => {
            const profileData = await fetchUserProfile();
            setUserProfile(profileData)
        };
    
        getUserProfile();

    }, []);

    //! ADDED
    const handleAddTrack = (track) => {
        console.log("Clicked Plus!")
        setUserTracks(prevTracks => [...prevTracks, track])
        // if (!userTracks.find(t => t.trackId === track.trackId)) { // Prevent duplicates
        //         setUserTracks([...userTracks, track]);
        // } else {
        //     console.log("duplicate")
        // }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTracks([]);
        
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

            const tracks = await createTracks(trackInformation);
            console.log(tracks[0]);
            setTracks(tracks);

            


        } catch (error) {
            console.error("Error fetching search results:", error)
        }
    }

    return (
        <div className="h-screen grid grid-rows-6 bg-transparent md:grid-cols-6 pl-2 pr-2 gap-2">

            {/* INFO CONTAINER */}
            <div className="row-span-3 grid grid-cols-2 grid-rows-12 md:col-span-3 md:row-span-5 bg-[rgba(106,106,128,0.25)] rounded-sm">

                 {/* IMAGE CONTAINER - COL 1*/}
                <div className="bg-yellow-500 row-span-3 p-2 flex justify-center items-center">
                    <div className="h-full w-full flex">
                         <img 
                         className="flex w-full h-full object-contain" 
                         src={musicPNG} />
                    </div>
                </div>

                {/* EXTRA INFO CONTAINER - COL 2 */}
                <div className="row-span-3 flex justify-start">
                    <div className="flex flex-col gap-2 items-start p-2">
                        <div className="bg-purple-500">
                            <input
                                placeholder="Playlist Name"
                                className="w-full"
                            >
                            
                            </input>
                        </div>

                        <div className="flex w-full gap-2">
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
                <div className="row-start-4 row-span-9 col-span-2 p-2">
                    <div className="border-2 border-black bg-purple-500 flex w-full h-full overflow-x-hidden overflow-y-auto">
                        <UserTrackList userTracks={userTracks}/>

                    </div>

                </div>

            </div>

            {/* SEARCH CONTAINER */}
            <div className="row-span-2 p-2 grid-rows-2 md:col-span-3 md:row-span-5 bg-[rgba(106,106,128,0.25)] rounded-sm flex flex-col">
                <div className="w-full">

                    <form 
                        action=""
                        className="w-full text-[#fffff0] border-white border-2"
                        onSubmit={handleSubmit}
                    >
                        <input
                            placeholder="Search a movie"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-[#fffff0] placeholder-[#fffff0]"
                        >
                        
                        </input>


                    </form>

                </div>
                <div className="flex h-full w-full overflow-x-hidden overflow-y-auto">

                    {tracks.length > 0 ? <TrackList tracksArray={tracks} onAddTrack={handleAddTrack}/> : <div></div>}

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
                    {/* <form 
                        action=""
                        className=""
                        onSubmit={handleSubmit}
                    >
                        <input
                            placeholder="Search a song"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        >
                        </input>


                    </form> */}
                </div>
            </div>
                   

        </div>

    )
}

export default Dashboard;
