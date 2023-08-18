import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// CS5356 TO-DO #0 Add your Firebase Config
const config = {
  apiKey: "AIzaSyDqRDpR4NVec0Q9Y7VdvtI4JsF7x-58STc",
  authDomain: "vacation-planner-8137d.firebaseapp.com",
  projectId: "vacation-planner-8137d",
  storageBucket: "vacation-planner-8137d.appspot.com",
  messagingSenderId: "517959539833",
  appId: "1:517959539833:web:5c89b35189ca912d6508a8",
  measurementId: "G-305LKH0GNN"
};

// CS5356 TO-DO #0 Uncomment these 2 lines after
//   adding your Firebase Config
firebase.initializeApp(config);
const firestoreDb = firebase.firestore();

// CS5356 TO-DO #1
export const createPost = async (post) => {
  // Create a Post object with 3 properties: username, name, and message
  await firestoreDb.collection("posts").add({
    likes: 0,
    userId: firebase.auth().currentUser.uid,
    vacationName: post.vacationName,
    location: post.location,
    lat: post.lat,
    lng: post.lng,    
    startDate: post.startDate,
    endDate: post.endDate,
    budget: post.budget,
    description: post.description,
    visability: post.visability,
    imageURL: post.imageURL
  });
};

// CS5356 TO-DO #2
export const getAllPosts = async () => {
  // Get all the posts in your collection
  // Each object should have an id, username, name, and message
  const querySnapshot = await firestoreDb
    .collection("posts")
    .where("userId", "==", firebase.auth().currentUser.uid)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return results;
};

export const getPublicPosts = async () => {
  // Get all the public posts
  const querySnapshot = await firestoreDb
    .collection("posts")
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return results;
};

// CS5356 TO-DO #3
export const deletePost = async (post) => {
  // Delete a post in your database
  try {
    await firestoreDb.collection("posts").doc(post.id).delete();
  } catch (err) {
    console.error(err);
  }
};

// CS5356 TO-DO #4
export const likePost = async (post) => {
  // Update a particular post and increment the like counter
  await firestoreDb
    .collection("posts")
    .doc(post.id)
    .update({
      likes: firebase.firestore.FieldValue.increment(1)
    });
};


export const editPost = async (post) => {
  // Update an entire document with new object
  await firestoreDb.collection("posts")
                   .doc(post.id)
                   .update(post)
};
