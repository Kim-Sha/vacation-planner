import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import VacationCards from "../components/VacationCards";
import MapBox from "../components/MapBox";
import * as db from "../database";
import { useRef, useState, useEffect } from "react";

export default function Home() {

    // POSTS
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const allPosts = await db.getAllPosts();
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Vacations</h1>
            <p>
                Welcome {firebase.auth().currentUser.displayName}! Time to get into the vacation mode!
            </p>
            <div className="grid grid-cols-2">
                <div>
                    <br />
                    <Link className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" to="/Form">Create New Vacation</Link>
                    <br /> <br />
                    {/* Map pointer allows vacation cards to have fly-to location effect on-hover */}
                    <VacationCards map={map} />
                </div>
                <div>
                    {/* <h2 className="text-3xl font-bold tracking-tight text-gray-900">Map</h2> */}
                    <br /> <br /> <br />
                    <div className="h-screen max-w-2xl">
                        {/* Passing posts to MapBox allows it to render markers for the vacation locations */}
                        <MapBox mapContainer={mapContainer} map={map} posts={posts} />
                    </div>
                </div>
            </div>
            <br />
            <br />
            
        </div>
    )
}