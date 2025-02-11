import spotifyPNG from "../../assets/images/Spotify_Primary_Logo_RGB_Green.png";

import { motion } from "motion/react";
import { useState, useRef} from "react";

const Nav = () => {
    const [isActive, setIsActive] = useState(false);

    // Define variants for dropdown animation
    const dropdownVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        closed: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.3, ease: "easeIn" }
        }
    };

    const firstText = useRef(null);
    const secondText = useRef(null);
    const slider = useRef(null);

    return (
        <nav className="grid grid-cols-3 items-center mt-1 pl-4 pr-4 pt-6 pb-2 md:pt-4  text-[#fffff0]">
            
            <div className="text-xl h-full md:flex md:flex-row md:justify-start">
                
                <div className="bg-[rgba(106,106,128,0.25)] hidden md:flex items-center justify-center h-full pl-5 pr-5 pt-1.5 pb-1.5 rounded-3xl">
                    <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
                        <img src={spotifyPNG} className="w-8 h-8"/>
                    </a>
                </div>

                <div className="bg-[rgba(106,106,128,0.25)] hidden md:flex items-center justify-center h-full pl-5 pr-5 pt-1.5 pb-1.5 rounded-3xl">
                    <a href="https://accounts.spotify.com/en/login">
                        Join Spotify
                    </a>
                </div>
            </div>

            <div className="text-xl font-bold text-center uppercase h-full flex justify-center items-center">Moviefy</div>

            <div
                className="flex flex-col justify-center items-end h-full cursor-pointer"
                onClick={() => setIsActive(!isActive)}
            >
                <div className="gap-1.5 flex flex-col bg-[rgba(106,106,128,0.25)] pl-5 pr-5 pt-1.5 pb-1.5 rounded-3xl h-full justify-center">

                    <motion.div
                        id="burger-bar"
                        className="w-6 h-0.5 bg-[#fffff0]"
                        animate={isActive ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        id="burger-bar"
                        className="w-6 h-0.5 bg-[#fffff0]"
                        animate={isActive ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
            
            <motion.div
                className="absolute top-16 right-4 bg-purple-700 text-[#fffff0] p-4 w-48 shadow-lg rounded-lg"
                initial="closed"
                animate={isActive ? "open" : "closed"}
                variants={dropdownVariants}
            >
                <ul>
                    <li className="py-2">
                        <a href="/">Home</a>
                    </li>
                    <li className="py-2">About</li>
                    <li className="py-2">Contact</li>
                    {/* <li className="py-2">Logout</li> */}
                </ul>
            </motion.div>
        </nav>
    );
};

export default Nav;
