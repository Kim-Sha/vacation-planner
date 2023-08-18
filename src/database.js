import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// CS5356 TO-DO #0 Add your Firebase Config
const config = {
  apiKey: "AIzaSyCph_Ir8q0ML1zwv5z3WgyehGTIAcZNmD0",
  authDomain: "bdsw-70360.firebaseapp.com",
  projectId: "bdsw-70360",
  storageBucket: "bdsw-70360.appspot.com",
  messagingSenderId: "571077077953",
  appId: "1:571077077953:web:79fde38621ab6d1d645d40",
  measurementId: "G-LKJQGSLZ26"
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
