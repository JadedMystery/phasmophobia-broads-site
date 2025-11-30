
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2WA7yotRlqNidwIgJcT19JNrK8ukMgs4",
  authDomain: "phasmophobiabroads.firebaseapp.com",
  projectId: "phasmophobiabroads",
  storageBucket: "phasmophobiabroads.firebasestorage.app",
  messagingSenderId: "503659624108",
  appId: "1:503659624108:web:6e57fbc6bf36b0d5989109"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
