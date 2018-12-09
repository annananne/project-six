// install firebase in terminal if you haven't already 

import firebase from "firebase";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDdUgLpYLp3gWdATOFFfwckTnGZfZ2Zano",
    authDomain: "wayfarerapp-23437.firebaseapp.com",
    databaseURL: "https://wayfarerapp-23437.firebaseio.com",
    projectId: "wayfarerapp-23437",
    storageBucket: "wayfarerapp-23437.appspot.com",
    messagingSenderId: "461130404875"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
