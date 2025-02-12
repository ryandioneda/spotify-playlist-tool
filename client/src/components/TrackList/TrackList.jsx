import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import Track from "../Track/Track";


const TrackList = ({tracksArray = [], onAddTrack }) => {
    console.log("Tracks array:", tracksArray)

    return (
        <div className="w-full text-[#fffff0]">
            {tracksArray.length > 0 ? (
                tracksArray.map((track) => (
                    <Track
                        key={track.index}
                        trackIndex={track.index} 
                        trackImage={track.imageUrl.url}
                        trackName={track.trackName}
                        trackArtist={track.artist}
                        trackIsExplicit={track.isExplicit}
                        onAddTrack={() => onAddTrack(track)}
                    />
                ))
            ) : (
                <p>No tracks</p>
            )}
        </div>
    )
}

export default TrackList;