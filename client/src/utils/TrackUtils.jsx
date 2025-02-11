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

export const createTracks = async (trackInformation) => {

    for (let i = 0; i < trackInformation.length; i++) {

    }
    

}


