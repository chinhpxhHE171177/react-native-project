import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
// ref - reference to a collection
import { getDatabase, ref as firebaseRef, set as firebaseSet, child, get, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCu0xAq_tgqhExYJCz9Nx2DWLlmav22YC4",
    authDomain: "demoapp-56378.firebaseapp.com",
    databaseUrl: "https://demoapp-56378-default-rtdb.firebaseio.com/",
    projectId: "demoapp-56378",
    storageBucket: "demoapp-56378.appspot.com",
    appId: '1:619755238967:android:015090ed20f6caa05fb1b2',
    messageingSenderId: "619755238967",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firebaseDatabase = getDatabase()

export {
    auth, firebaseDatabase, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, firebaseRef, firebaseSet, sendEmailVerification, child, get, onValue, app
}
