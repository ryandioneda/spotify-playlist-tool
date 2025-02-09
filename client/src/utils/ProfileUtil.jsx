
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchUserProfile = async () => {
    const response = await fetch(`${SERVER_URL}/user/profile`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching profile");
    }
    
    const data = await response.json();
    console.log("User profile:", data);
    return data; 
}
