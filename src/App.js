import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const  [user, setUser] = useState({
    isSignedIn: false, 
    name: '',
    email: '',
    photo: '',
    password: '',
  });

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
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

  const handleFbSignIn = () => {
       firebase.auth().signInWithPopup(fbProvider)
       .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log('fb using after sign in', user);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const SignOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        error: '',
        success: false
      }
      setUser(SignOutUser);
      console.log(res);
    })
    .catch(err => {
      
    })
  }

  const handleBlur = (e) => {
    let isFiledValid = true;
    if(e.target.name ===  'email'){
      isFiledValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFiledValid = isPasswordValid && passwordHasNumber;
    }
    if(isFiledValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
        if(newUser && user.email && user.password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch(error => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
      });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', res.user)
      })
      .catch((error) => {
        const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
      });
    }

    e.preventDefault();
  } 

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('user name update successfully')
    }).catch(function(error) {
      console.log(error);
    });
  }
  return (
    <div className="App">
      <h1> Firebase App </h1>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : 
        <button onClick={handleGoogleSignIn}> <h3>Sign in with google</h3> </button>
      }
      <br/>
      <br/>
      <button onClick={handleFbSignIn}> <h3>Sign in using facebook</h3> </button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <h1>{user.email}</h1>
          <img src={user.photo}></img>
          </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <br/><br/>
      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Your Name"/>
        }
        <br/>
        <input type="" onBlur={handleBlur} name="email" placeholder="Your email address" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" placeholder="Your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign In'}/>
      </form>
      <h2 style={{color: 'red'}}> {user.error} </h2>
      {
        user.success && <h3 style={{color: 'green'}}>User {newUser ? 'created': 'Logged In'} successfully</h3>
      }
   </div>
  );
}

export default App;
