import { useState } from "react";

const TrackList = ({tracksArray = []}) => {
    console.log("Tracks array:", tracksArray)

    return (
        <div>
            {tracksArray.length > 0 ? (
                tracksArray.map((track) => (
                    <div id="track-item-container" key={track.index} className="bg-green-500 p-2 flex w-full mb-2.5">
                        <div className="flex justify-center items-center mr-2">
                            <p>{track.index + 1}</p>
                        </div>
                        <div id="image-container" className="w-12 h-12">
                            <img src={track.imageUrl.url} className="bg-yellow-500 h-full w-full object-contain rounded-sm"/>
                        </div>

                        <div id="song-info" className="flex flex-col bg-red-500">
                            <div id="song-name">
                                <p className="bg-purple-500">{track.trackName}</p>
                            </div>
                            <div id="song-artist">
                                <p className="bg-orange-500">{track.artist}</p>
                            </div>
                        </div>
                        <p classame="bg-pink-500">{track.isExplicit ? "E" : ""}</p>
                    </div>
                ))
            ) : (
                <p>No tracks</p>
            )}
        </div>
    )

}

export default TrackList;