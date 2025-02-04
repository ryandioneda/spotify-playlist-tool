import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Index() {

    const handleLogin = () => {
        window.location.href = `${SERVER_URL}/auth/spotify/login`;
    }


    return (
        <div className="pl-10 pr-10 pt-40 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-10">
                <div className="text-center uppercase text-5xl text-[#fffff0]">
                    Create perfect
                    <br></br>
                    playlists for
                    <br></br>
                    any movie
                </div> 
            </div>

            <div className="flex justify-center items-center">
                <button
                    className="bg-[#F76C6C] p-4 rounded-3xl" 
                    onClick={handleLogin}
                >
                    Log in With Spotify

                </button>
            </div>

        </div>
    )
}
export default Index;