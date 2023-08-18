import React from "react";
import { useNavigate } from "react-router-dom";
import * as db from "../database";
import { useRef, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { v4 as uuidv4 } from "uuid";
import MapBox from "./MapBox";

const storage = firebase.storage();
const firestore = firebase.firestore();

function UpdateForm({post}) {
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState(null);

  const handleChange = (e) => {
    setImages(e.target.files[0]);
    document.getElementById('file-upload-text').innerHTML = "File Uploaded!";
  };

  const handleImageUpload = async (image) => {
    const uniqueFilename = uuidv4();
    const uploadTask = storage.ref(`images/${uniqueFilename}`).put(image);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          resolve(downloadURL);
        }
      );
    });
  };

  // Create pointers for the MapBox component
  const mapContainer = useRef(null); // container ID
  const map = useRef(null);  
  
  const getPosts = async () => {
    const allPosts = await db.getAllPosts();
    setPosts(allPosts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Retrieve MapBox searched location
    let mapboxAddress = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].value
    const mapboxInput = document.getElementById('mapbox-input')
    let lat = mapboxInput.getAttribute("data-lat");
    let lng = mapboxInput.getAttribute("data-lng");
    // Add (and overwrite if needed) to post object if all 3 location attributes non-null
    // Else use pre-existing location data from post
    if (!(mapboxAddress && lat && lng) && post) {
      lat = post.lat
      lng = post.lng
      mapboxAddress = post.location
    };

    let newPost = {
      vacationName: e.target["vacation-name-input"].value,
      location: mapboxAddress,
      lat: lat,
      lng: lng,
      startDate: e.target["start-date-input"].value,
      endDate: e.target["end-date-input"].value,
      budget: e.target["budget-input"].value,
      description: e.target["description-input"].value,
      visability: e.target["visability-input"].value,
    };
    
    let imageURL = null;
    const imageFile = e.target["photo-input"].files[0];
    if (imageFile) {
      imageURL = await handleImageUpload(imageFile);
    } else if (post) {
      imageURL = post.imageURL
    }
    newPost.imageURL = imageURL      

    // If no pre-existing post data passed in, create new post.
    // Else, update existing post    
    if (post) {
      await db.editPost({...{id: post.id}, ...newPost});
    } else {
      await db.createPost(newPost);
    }
    await getPosts();

    navigate("/");
  };

  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <form onSubmit={onSubmit}> 
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                
                <div className="sm:col-span-4">
                  <label htmlFor="name_of_vacation" className="block text-sm font-medium leading-6 text-gray-900">Name of Vacation</label>
                  <div className="mt-2">
                    <input id="name_of_vacation" defaultValue={post ? post.vacationName : ''} type="text" name="vacation-name-input" className="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="visability" className="block text-sm font-medium leading-6 text-gray-900">Vacation Visability</label>
                  <div className="mt-2">
                    <select id="visability" defaultValue={post ? post.visability : ''} name="visability-input" className="block pl-3 pr-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
        
                <div className="sm:col-span-4">
                  <label htmlFor="start_date" className="block text-sm font-medium leading-6 text-gray-900">Start Date</label>
                  <div className="mt-2">
                    <input id="start_date" defaultValue={post ? post.startDate : ''} name="start-date-input" type="date" className="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                  </div>
                </div>
        
                <div className="sm:col-span-4">
                  <label htmlFor="end_date" className="block text-sm font-medium leading-6 text-gray-900">End Date</label>
                  <div className="mt-2">
                    <input id="end_date" defaultValue={post ? post.endDate : ''} name="end-date-input" type="date" className="block pl-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                  </div>
                </div>
        
                <div className="col-span-full h-96">
                  <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                    {post ? `Location: ${post.location ? post.location : 'None'}` : 'Location'}
                  </label>
                  {/* <div className="mt-2">
                    <select id="country" defaultValue={post ? post.location : ''} name="location-input" autoComplete="country-name" className="block pl-3 pr-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div> */}
                    <MapBox id="mapbox-input" mapContainer={mapContainer} map={map} posts={post ? [post] : null} lat={post ? post.lat : null} lng={post ? post.lng : null} />
                </div>
        
                <div className="sm:col-span-4">
                  <label htmlFor="budget" className="block text-sm font-medium leading-6 text-gray-900">Budget</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">USD</span>
                      <input type="number" id="budget" defaultValue={post ? post.budget : ''} name="budget-input" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="1000"></input>
                    </div>
                  </div>
                </div>
        
                <div className="col-span-full">
                  <label htmlFor="itinerary" className="block text-sm font-medium leading-6 text-gray-900">Itinerary Details</label>
                  <div className="mt-2">
                    <textarea id="itinerary" defaultValue={post ? post.description : ''} name="description-input" rows="3" className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                  </div>
                </div>
        
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span id='file-upload-text'>Upload an Image</span>
                          <input id="file-upload" name="photo-input" type="file" className="sr-only" onChange={handleChange}></input>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" onClick={() => {navigate("/")}} className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateForm