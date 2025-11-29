
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Read room + name from URL (?room=...&name=...)
const params = new URLSearchParams(window.location.search);
const room = params.get("room") || "LOBBY";
const name = params.get("name") || "Investigator";

const msgRef = collection(db, "rooms", room, "messages");
const q = query(msgRef, orderBy("createdAt"));

const chatBox = document.getElementById("chatMessages");
const input   = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendMsg");

// Listen for new messages
onSnapshot(q, (snapshot) => {
  if (!chatBox) return;
  chatBox.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const row  = document.createElement("div");
    row.className = "chat-msg";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = data.name || "Investigator";

    const textSpan = document.createElement("span");
    textSpan.className = "text";
    textSpan.textContent = data.text || "";

    row.appendChild(nameSpan);
    row.appendChild(textSpan);
    chatBox.appendChild(row);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
async function sendMessage() {
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  await addDoc(msgRef, {
    name,
    text,
    createdAt: serverTimestamp()
  });
  input.value = "";
}

if (sendBtn) {
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}
