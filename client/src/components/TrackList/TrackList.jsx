import { useState } from "react";

const TrackList = ({tracksArray = []}) => {
    console.log("Tracks array:", tracksArray)

    return (
        <div className="w-full text-[#fffff0]">
            {tracksArray.length > 0 ? (
                tracksArray.map((track) => (


                    <div id="track-item-container" key={track.index} className="p-2 flex w-full mb-0.5 md:mb-1.5 hover:bg-white/30 rounded-md relative group">
                        {/* <div className="absolute bg-red-500 p-2 flex items-center justify-center text-lg text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="">+</p>
                        </div> */}
                        <div className="absolute p-2 pr-5 flex items-center justify-end w-full text-white/60 opacity-0 group-hover:opacity-100 duration-100">
                            +

                        </div>

                        <div className="flex justify-center items-center mr-3 text-white/50">
                            <p>{track.index + 1}</p>
                        </div>
                        <div id="image-container" className="w-12 h-12 mr-3">
                            <img src={track.imageUrl.url} className="h-full w-full object-contain rounded-sm"/>
                        </div>

                        <div id="song-info" className="flex flex-col w-full text-sm">
                            <div id="song-name" className="">
                                <p className="">{track.trackName}</p>
                            </div>
                            <div id="extra" className="flex gap-2 items-end">
                                {track.isExplicit && <p className="bg-white/50 pl-1 pr-1 rounded-sm text-xs">E</p>}
                                <p className="text-white/60">{track.artist}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No tracks</p>
            )}
        </div>
    )

}

export default TrackList;