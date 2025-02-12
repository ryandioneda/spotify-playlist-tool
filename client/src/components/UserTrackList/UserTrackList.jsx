
import Track from "../Track/Track";

const UserTrackList = ({ userTracks, onAddTrack }) => {
    console.log("In user track, rendering!");

    return (
        <div className="w-full text-[#fffff0]">
            {userTracks.length > 0 ? (
                userTracks.map((track, index) => (
                    <Track
                        key={track.id || index} // Ensure unique key
                        trackIndex={index}
                        trackImage={track.imageUrl?.url} // Ensure trackImage exists
                        trackName={track.trackName}
                        trackArtist={track.artist}
                        trackIsExplicit={track.isExplicit}
                        onAddTrack={() => onAddTrack(track)} // Handle track addition
                    />
                ))
            ) : (
                <p>No tracks</p>
            )}
        </div>
    );
};

export default UserTrackList;
