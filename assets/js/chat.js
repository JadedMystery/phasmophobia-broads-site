// Firebase Chat System (Realtime Firestore)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2WA7yotRlqNidwIgJcT19JNrK8ukMgs4",
  authDomain: "phasmophobiabroads.firebaseapp.com",
  projectId: "phasmophobiabroads",
  storageBucket: "phasmophobiabroads.firebasestorage.app",
  messagingSenderId: "503659624108",
  appId: "1:503659624108:web:6e57fbc6bf36b0d5989109"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const room = params.get("room") || "BROADS";
const name = params.get("name") || "Hunter";

const msgInput = document.getElementById("msgInput");
const messagesDiv = document.getElementById("messages");
const sendBtn = document.getElementById("sendMsg");

sendBtn.onclick = async () => {
    const text = msgInput.value.trim();
    if (!text) return;

    await addDoc(collection(db, "rooms", room, "messages"), {
        name: name,
        text: text,
        timestamp: serverTimestamp()
    });

    msgInput.value = "";
};

const q = query(collection(db, "rooms", room, "messages"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement("div");
        item.className = "msgItem";
        item.textContent = data.name + ": " + data.text;
        messagesDiv.appendChild(item);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
