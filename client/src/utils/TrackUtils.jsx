const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchTracks = async (trackIDs) => {
    try {
        if (!trackIDs || trackIDs.length === 0) return null;

        // URL-encode the comma-separated list of track IDs
        const encodedIds = encodeURIComponent(trackIDs.join(","));
        const response = await fetch(`${SERVER_URL}/api/v2/tracks?ids=${encodedIds}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch tracks");

        return await response.json();
    } catch (error) {
        console.error("Error fetching tracks:", error);
        return null;
    }
};

export const createTracks = async (data) => {
    console.log("called create")

    let tracksArray = [];

    for (let i = 0; i < data.tracks.length; i++) {
        const imageUrl = getTrackImage(data.tracks[i]);
        const artist = getArtist(data.tracks[i])
        const trackName = getTrackName(data.tracks[i])
        const isExplicit = getIsExplicit(data.tracks[i])
        const uri = getURI(data.tracks[i])

        tracksArray.push({
            index: i,
            imageUrl,
            artist,
            trackName,
            isExplicit,
            uri
        });

    }
    console.log(tracksArray)
    return tracksArray
}


const getTrackImage = (trackJsonObject) => {
    const imageUrl = trackJsonObject.album.images[2]
    return imageUrl


}

const getArtist = (trackJsonObject) => {
    const artist = trackJsonObject.artists[0].name
    return artist
}


const getTrackName = (trackJsonObject) => {
    const name = trackJsonObject.name
    return name


}

const getIsExplicit = (trackJsonObject) => {
    const isExplicit = trackJsonObject.explicit
    return isExplicit

}

const getURI = (trackJsonObject) => {
    const uri = trackJsonObject.uri
    return uri

}

//! fetches playback route
export const fetchPlayback = () => {

}



