import React from "react";
import { Link } from "react-router-dom";
import * as db from "../database";
import { useState, useEffect } from "react";

function VacationCards(props) {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
      const allPosts = await db.getAllPosts();
      setPosts(allPosts);
  };

  useEffect(() => {
      getPosts();
  }, []);

  return (
    <div>
    {posts.map((post, index) => {
      return (
        <div key={`post_${index}`} className="bg-white" onMouseOver={() => {
          if (post.lng && post.lat) {
            props.map.current.flyTo({
              center: [post.lng, post.lat],
              essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });              
          }
        }}>
          <div className="mx-auto max-w-3xl py-2 sm:px-6 sm:py-8 lg:px-8">
            <div className="relative isolate overflow-hidden px-5 pt-2 shadow-lg sm:rounded-lg sm:px-5 md:pt-6 lg:flex lg:gap-x-1 lg:px-6 lg:pt-0">
              <div className="mx-auto max-w-md text-left lg:mx-0 lg:flex-auto lg:py-6 lg:text-left">
                <h2 className="text-lg font-bold tracking-tight text-black sm:text-xl">{post.vacationName}</h2>
                <p className="mt-1 text-base leading-6 text-gray-400">{post.location}</p>
                <span className="mt-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">{post.startDate} - {post.endDate}</span>
                <div className="mt-6 flex items-center justify-center gap-x-4 lg:justify-start">
                  <Link className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        to="/Form" state={post}>
                    Details
                  </Link>
                  <button
                          onClick={async () => {
                            await db.deletePost(post);
                            await getPosts();
                          }}
                          className="rounded-md px-3 py-2 text-sm font-semibold leading-6 text-black hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                </div>
              </div>
              {post.imageURL ? <div className="relative">
                <img className="absolute left-0 top-0 w-[20rem] max-w-none bg-white/5 ring-1 ring-white/10" src={post.imageURL} alt="App screenshot" width="1824" height="1080" />
              </div> : null}
            </div>
          </div>
        </div>
      )
    })}
    </div>
  );
};

export default VacationCards