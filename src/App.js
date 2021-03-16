import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
const  [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  photo: ''
});

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const SignOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(SignOutUser);
      console.log(res);
    })
    .catch(err => {
      
    })
  }
  return (
    <div className="App">
      <h1> Firebase App </h1>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : 
        <button onClick={handleSignIn}>Sign in with google</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <h1>{user.email}</h1>
          <img src={user.photo}></img>
          </div>
      }
    </div>
  );
}

export default App;
