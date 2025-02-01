import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Index() {

    const handleLogin = () => {
        window.location.href = `${SERVER_URL}/auth/spotify/login`;
    }

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const code = urlParams.get("code");
    //     console.log(code)

    //     if (code) {
    //         fetchTokens(code);
    //     }
    // }, []);

    return (
        <button onClick={handleLogin}>
            Login with spotify
        </button>
    )
}
export default Index;