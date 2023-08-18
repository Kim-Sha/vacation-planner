import React from 'react';
import PublicVacationCards from "../components/PublicVacationCards";
import MapBox from "../components/MapBox";
import * as db from "../database";
import { useRef, useState, useEffect } from "react";

function Explore() {

    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const allPosts = await db.getPublicPosts();
        setPosts(allPosts);
    };
  
    useEffect(() => {
        getPosts();
    }, []);

    // Create pointers for the MapBox component
    const mapContainer = useRef(null); // container ID
    const map = useRef(null);     

    return (
        <div style={{ marginLeft: "50px", marginTop: "50px" }}>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Public Vacations</h1>
            <p>
                Explore public vacations and get inspired!
            </p>
            <div className="grid grid-cols-2">
                <div>
                    <br />
                    <br />
                    {/* Map pointer allows vacation cards to have fly-to location effect on-hover */}
                    <PublicVacationCards map={map} />
                </div>
                <div>
                    <br /> <br /> <br />
                    <div className="h-screen max-w-2xl">
                        {/* Passing posts to MapBox allows it to render markers for the vacation locations */}
                        <MapBox mapContainer={mapContainer} map={map} posts={posts.filter(post => post.visability == 'Public')}/>
                    </div>
                </div>
            </div>
            <br />
            <br />
            
        </div>
    )
}

export default Explore;