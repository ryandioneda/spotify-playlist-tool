
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const getUserProfile = async () => {
    const response = await fetch(`${SERVER_URL}/user/profile`, {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        const data = await response.json();
        console.log("User profile:", data)
    } else {
        console.log("Error fetching profile");
    }
}

export default getUserProfile;