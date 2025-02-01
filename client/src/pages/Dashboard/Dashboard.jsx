import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import getUserProfile from "../../utils/ProfileUtil";

function Dashboard() {


    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     fetchSearch();
    // }
    

    // return (
    //     <form action="" className="" onSubmit={handleSubmit}>
    //         <input type="text" placeholder="Search a movie!" className="" onChange={(e) => setSearchTerm(e.target.value)}>

    //         </input>
    //     </form>
    // )

    return (
        <button onClick={getUserProfile}>
            Tell me user!

        </button>
    )
}

export default Dashboard;
