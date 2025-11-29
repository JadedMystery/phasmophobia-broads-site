
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your Firebase config from Starla
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

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    room: params.get("room") || "BROADSVAN",
    name: params.get("name") || "Investigator",
    avatar: params.get("avatar") || ""
  };
}

function applyAvatarOverlay(name, avatar) {
  const label = document.getElementById("monitorAvatarLabel");
  const initialsEl = document.getElementById("monitorAvatarInitials");
  const circle = document.getElementById("monitorAvatarCircle");

  if (label) label.textContent = name;

  if (avatar && circle) {
    circle.innerHTML = "";
    const img = document.createElement("img");
    img.src = avatar;
    circle.appendChild(img);
  } else if (initialsEl) {
    const parts = name.trim().split(/\s+/);
    let initials = "";
    if (parts.length === 1) initials = parts[0].substring(0,2).toUpperCase();
    else initials = (parts[0][0] + parts[1][0]).toUpperCase();
    initialsEl.textContent = initials;
  }
}

function appendChatMessage(docData) {
  const list = document.getElementById("chatMessages");
  if (!list) return;

  const row = document.createElement("div");
  row.className = "chat-message";

  const nameSpan = document.createElement("span");
  nameSpan.className = "chat-name";

  const textSpan = document.createElement("span");

  const type = docData.type || "chat";
  const text = docData.text || "";
  const name = docData.name || "Investigator";

  if (type === "system") {
    nameSpan.textContent = "[System]";
    textSpan.textContent = " " + text;
  } else {
    nameSpan.textContent = name + ":";
    textSpan.textContent = " " + text;
  }

  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  list.appendChild(row);
  list.scrollTop = list.scrollHeight;
}

async function addSystemMessage(roomId, text, kind) {
  const colRef = collection(db, "rooms", roomId, "messages");
  try {
    await addDoc(colRef, {
      type: "system",
      kind: kind || "info",
      text,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error adding system message", e);
  }
}

async function addChatMessage(roomId, name, avatar, text) {
  const colRef = collection(db, "rooms", roomId, "messages");
  try {
    await addDoc(colRef, {
      type: "chat",
      name,
      avatar: avatar || "",
      text,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error adding chat message", e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { room, name, avatar } = getParams();
  const roomId = room || "BROADSVAN";

  const roomLabel = document.getElementById("room-label");
  const nameLabel = document.getElementById("player-label");
  if (roomLabel) roomLabel.textContent = roomId;
  if (nameLabel) nameLabel.textContent = name;

  const back = document.getElementById("backToLobby");
  if (back) {
    back.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  applyAvatarOverlay(name, avatar);

  // play van ambient once
  const vanAmbient = document.getElementById("van-ambient");
  if (vanAmbient) {
    vanAmbient.volume = 0.25;
    vanAmbient.play().catch(() => {});
  }

  // Firestore realtime listener for this room's messages
  const colRef = collection(db, "rooms", roomId, "messages");
  const q = query(colRef, orderBy("createdAt", "asc"));

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        appendChatMessage(data);

        // Play join/leave sounds for system messages
        if (data.type === "system" && data.kind) {
          if (data.kind === "join") {
            const joinSfx = document.getElementById("join-sfx");
            if (joinSfx) {
              joinSfx.currentTime = 0;
              joinSfx.play().catch(() => {});
            }
          } else if (data.kind === "leave") {
            const leaveSfx = document.getElementById("leave-sfx");
            if (leaveSfx) {
              leaveSfx.currentTime = 0;
              leaveSfx.play().catch(() => {});
            }
          }
        }
      }
    });
  });

  // Send join system message when entering the van
  addSystemMessage(roomId, name + " joined the investigation.", "join");

  const openBtn = document.getElementById("openRoomBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const url = "https://meet.jit.si/PhasmaBroads-" + encodeURIComponent(roomId);

      const hunt = document.getElementById("hunt-sfx");
      if (hunt) { hunt.currentTime = 0; hunt.play().catch(() => {}); }

      window.open(url, "_blank");
    });
  }

  // shared van chat form
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      await addChatMessage(roomId, name, avatar, text);
      chatInput.value = "";
    });
  }

  // send a leave system message when the user closes / navigates away
  window.addEventListener("beforeunload", () => {
    // fire and forget
    addSystemMessage(roomId, name + " left in a hurry...", "leave");
  });
});
