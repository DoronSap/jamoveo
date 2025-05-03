// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBxwHVTZm2JAnRh_RSJQamxY4V56nwqv6w",
    authDomain: "lyrics-249b5.firebaseapp.com",
    databaseURL: "https://lyrics-249b5-default-rtdb.firebaseio.com",
    projectId: "lyrics-249b5",
    storageBucket: "lyrics-249b5.firebasestorage.app",
    messagingSenderId: "457885058283",
    appId: "1:457885058283:web:554af932b12832cfdbaaae"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };
