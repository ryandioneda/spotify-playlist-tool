import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Index() {
    const API_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    const handleLogin = async () => {
        window.location.href = `${API_URL}/auth/authorize`
    };


    return (
        <button onClick={handleLogin}>
            Login with spotify
        </button>
    )
}
export default Index;