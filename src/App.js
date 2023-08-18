import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StyledFirebaseAuth } from "react-firebaseui";
import "./styles.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import Layout from "./pages/Layout";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Form from "./pages/Form";

// Configuration for StyledFirebaseAuth
const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const requiresLogin = Component => {
    if (isSignedIn) {
      return Component
    } else {
      return (
        <div>
          {!!firebase.apps.length && (
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          )}
        </div>
      );
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    if (firebase.apps.length) {
      const unregisterAuthObserver = firebase
        .auth()
        .onAuthStateChanged((user) => {
          setIsSignedIn(!!user);
        });
      return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={requiresLogin(<Home />)} />
          <Route path="Explore" element={<Explore />} />
          <Route path="Form" element={requiresLogin(<Form />)} />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
