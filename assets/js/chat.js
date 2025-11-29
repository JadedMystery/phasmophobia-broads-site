import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const room = params.get("room");
const name = params.get("name");

const msgRef = collection(db, "rooms", room, "messages");
const q = query(msgRef, orderBy("createdAt"));

onSnapshot(q, snap => {
  const box = document.getElementById("chatMessages");
  box.innerHTML = "";
  snap.forEach(doc => {
    const d = doc.data();
    const div = document.createElement("div");
    div.textContent = d.name + ": " + d.text;
    box.appendChild(div);
  });
});

document.getElementById("sendMsg").onclick = async () => {
  const text = document.getElementById("chatInput").value;
  if(!text) return;
  await addDoc(msgRef, { name, text, createdAt: serverTimestamp() });
  document.getElementById("chatInput").value = "";
};

// Basic glitch effect placeholder
const canvas = document.getElementById("glitchCanvas");
const ctx = canvas.getContext("2d");
function drawGlitch(){
  ctx.fillStyle = "#0f0";
  ctx.fillRect(0,0,400,300);
  const glitchHeight = Math.random()*50;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, glitchHeight, 400, 5);
}
setInterval(drawGlitch, 500);
