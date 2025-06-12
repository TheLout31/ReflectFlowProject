import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZEwe-uIlzaxcobXNp3K0kKubyC70_hdM",
  authDomain: "paievaluation.firebaseapp.com",
  databaseURL:
    "https://paievaluation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paievaluation",
  storageBucket: "paievaluation.firebasestorage.app",
  messagingSenderId: "19826895367",
  appId: "1:19826895367:web:26db7fca34a0c4f4bf18a2",
  measurementId: "G-CLQXV78Y32",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
