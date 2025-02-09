import { data } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchSearchResults = async (search) => {
    let data = null;

    const response = await fetch(`${SERVER_URL}/api/v2/playlists/${search}`, {
        method:"GET",
        credentials: "include",
    });

    if (response.ok) {
        data = await response.json()
    } else {
        console.log("Error fetching search")
    }
    return data
}