
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
  const p = new URLSearchParams(window.location.search);
  return {
    room: (p.get("room") || "BROADSVAN").toUpperCase(),
    name: (p.get("name") || "Investigator").trim() || "Investigator"
  };
}

/* Avatar initials */
function initials(name) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || "?").toUpperCase();
}

/* Ghost AI canned lines (client-side, no external API) */
const ghostLines = [
  "…I see you in the truck. Come inside.",
  "The basement is getting lonely.",
  "Someone dropped their sanity at the door.",
  "Did you really think the van would save you?",
  "Footsteps. Behind you. Don’t turn around.",
  "Your EMF reader is lying.",
  "I like the one who screams the loudest.",
  "Who touched my Ouija board?",
  "You left the light on. I turned it off.",
  "Keep talking. I’m listening through the spirit box."
];

function randomGhostLine() {
  return ghostLines[Math.floor(Math.random() * ghostLines.length)];
}

/* Append message DOM */
function appendMessage(msg, currentUser) {
  const box = document.getElementById("chatMessages");
  if (!box) return;

  const row = document.createElement("div");
  row.className = "chat-message";

  const type = msg.type || "chat";

  if (type === "system") row.classList.add("system");
  if (type === "dm") row.classList.add("dm");
  if (type === "ghost") row.classList.add("ghost");

  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.textContent = initials(msg.name || "?");

  const nameSpan = document.createElement("span");
  nameSpan.className = "chat-name";
  if (type === "dm") {
    nameSpan.textContent = (msg.name || "Investigator") + " [DM]:";
  } else if (type === "system") {
    nameSpan.textContent = (msg.name || "SYSTEM") + ":";
  } else {
    nameSpan.textContent = (msg.name || "Investigator") + ":";
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = " " + (msg.text || "");

  const timeSpan = document.createElement("span");
  timeSpan.className = "chat-timestamp";
  if (msg.createdAt && msg.createdAt.toDate) {
    const d = msg.createdAt.toDate();
    timeSpan.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    timeSpan.textContent = "";
  }

  row.appendChild(avatar);
  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  row.appendChild(timeSpan);

  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

/* Typing indicator */
let typingTimeout = null;
async function sendTyping(room, name) {
  const docRef = doc(db, "rooms", room, "typing", name);
  await setDoc(docRef, { typing: true, updated: Date.now() });
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(async () => {
    await setDoc(docRef, { typing: false, updated: Date.now() });
  }, 2000);
}

function listenTyping(room, currentUser) {
  const indicator = document.getElementById("typingIndicator");
  if (!indicator) return;
  const typingRef = collection(db, "rooms", room, "typing");

  onSnapshot(typingRef, snap => {
    const users = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.typing && d.id !== currentUser) {
        users.push(d.id);
      }
    });
    if (users.length > 0) {
      indicator.textContent = users.join(", ") + " is typing...";
    } else {
      indicator.textContent = "";
    }
  });
}

/* System message helper */
async function sendSystemMessage(room, text) {
  const messagesRef = collection(db, "rooms", room, "messages");
  await addDoc(messagesRef, {
    text,
    name: "SYSTEM",
    type: "system",
    createdAt: serverTimestamp()
  });
}

/* Ghost AI message helper (client-side canned) */
async function sendGhostMessage(room) {
  const messagesRef = collection(db, "rooms", room, "messages");
  const rawRoom = (room || "").toString();
  const mapKey = rawRoom.split("-")[0].toUpperCase();

  let text;
  if (mapGhostLines[mapKey] && mapGhostLines[mapKey].length > 0) {
    const arr = mapGhostLines[mapKey];
    text = arr[Math.floor(Math.random() * arr.length)];
  } else {
    const type = randomPersonality();
    text = randomPersonalityLine(type);
  }

  await addDoc(messagesRef, {
    text,
    name: "Ghost",
    type: "ghost",
    createdAt: serverTimestamp()
  });

  playScream();
  heavySanityDrain();
  spikeEMF();
  flickerScreen();
});
}

/* Setup room list chips (predefined popular rooms, does NOT affect layout) */
function setupRoomChips(currentRoom, name) {
  const container = document.getElementById("roomQuickList");
  if (!container) return;

  const rooms = [
    { code: "BROADSVAN", label: "Main Van" },
    { code: "TANGLEWOOD-TRUCK", label: "Tanglewood - Truck" },
    { code: "TANGLEWOOD-BASEMENT", label: "Tanglewood - Basement" },
    { code: "WILLOW-TRUCK", label: "Willow - Truck" },
    { code: "RIDGEVIEW-TRUCK", label: "Ridgeview - Truck" }
  ];

  container.innerHTML = "";
  rooms.forEach(r => {
    const chip = document.createElement("div");
    chip.className = "room-chip";
    chip.textContent = r.label;
    if (r.code === currentRoom) {
      chip.style.borderColor = "#38bdf8";
    }
    chip.addEventListener("click", () => {
      const url = new URL("chat.html", window.location.href);
      url.searchParams.set("room", r.code);
      url.searchParams.set("name", name);
      window.location.href = url.toString();
    });
    container.appendChild(chip);
  });
}

/* Setup chat: handles normal, DM, ghost commands */
function setupChat(room, name) {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const list = document.getElementById("chatMessages");

  if (!form || !input || !list) return;

  const messagesRef = collection(db, "rooms", room, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  onSnapshot(q, snap => {
    list.innerHTML = "";
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const type = data.type || "chat";

      // Private DM: only show if you're sender or recipient
      if (type === "dm") {
        const to = (data.to || "").trim();
        if (to.toLowerCase() !== name.toLowerCase() &&
            (data.name || "").trim().toLowerCase() !== name.toLowerCase()) {
          return;
        }
      }

      appendMessage(data, name);
    });
    list.scrollTop = list.scrollHeight;
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    input.value = "";

    // Commands:
    // /dm Name message...
    if (raw.toLowerCase().startsWith("/dm ")) {
      const rest = raw.slice(4).trim();
      const firstSpace = rest.indexOf(" ");
      if (firstSpace > 0) {
        const target = rest.slice(0, firstSpace).trim();
        const msg = rest.slice(firstSpace + 1).trim();
        if (target && msg) {
          await addDoc(messagesRef, {
            text: msg,
            name,
            to: target,
            type: "dm",
            createdAt: serverTimestamp()
          });
        }
      }
      return;
    }

    // Ghost AI trigger: /ghost or !ghost
    if (raw.toLowerCase() === "/ghost" || raw.toLowerCase() === "!ghost") {
      await addDoc(messagesRef, {
        text: "…invoking something on the other side.",
        name,
        type: "system",
        createdAt: serverTimestamp()
      });
      await sendGhostMessage(room);
      return;
    }

    // Normal chat
    drainSanity();
    await addDoc(messagesRef, {
      text: raw,
      name,
      type: "chat",
      createdAt: serverTimestamp()
    });
  });

  input.addEventListener("input", () => sendTyping(room, name));
}


// Extra ghost personalities and scream SFX hooks
const ghostPersonalities = {
  demon: ["I will tear you apart.", "Run while you can."],
  banshee: ["I found my target.", "Your voice is shaking."],
  yokai: ["Too loud...", "Silence yourselves."]
};
const mapGhostLines = {
  TANGLEWOOD: [
    "These walls remember every scream.",
    "You’ve walked these halls before… in a nightmare."
  ],
  WILLOW: [
    "The campsite isn’t as empty as you think.",
    "The trees whisper your name."
  ],
  RIDGEVIEW: [
    "So many rooms to die in.",
    "You should have stayed in the truck."
  ]
};

function randomPersonalityLine(type){
  const arr=ghostPersonalities[type]||ghostLines;
  return arr[Math.floor(Math.random()*arr.length)];
}
// Scream SFX placeholder
function playScream(){
  const a=new Audio('assets/sfx/scream.mp3');
  a.play().catch(()=>{});
}
// Sanity meter simple decrement
let sanity=100;
let lastChatTime=0;
function drainSanity(){
  const now = Date.now();
  let diff = now - lastChatTime;
  lastChatTime = now;
  let amount = 1;
  if (diff < 5000) amount = 3;
  if (diff < 2000) amount = 5;
  sanity = Math.max(0, sanity - amount);
  const el=document.getElementById("sanityBar");
  const pct=document.getElementById("sanityPct");
  if(el){ el.style.width = sanity + '%'; }
  if(pct){ pct.textContent = sanity + '%'; }
}
}


// ==== Enhanced sanity drain on ghost events ====
function heavySanityDrain(){
  sanity = Math.max(0, sanity - 10);
  const el=document.getElementById("sanityBar");
  const pct=document.getElementById("sanityPct");
  if(el){ el.style.width = sanity + '%'; }
  if(pct){ pct.textContent = sanity + '%'; }
}

// ==== Random ghost personality picker ====
function randomPersonality(){
  const keys = Object.keys(ghostPersonalities);
  return keys[Math.floor(Math.random()*keys.length)];
}

// Override ghost message to use random personality lines
async function sendGhostMessage(room) {
  const type = randomPersonality();
  const messagesRef = collection(db, "rooms", room, "messages");
  await addDoc(messagesRef, {
    text: randomPersonalityLine(type),
    name: "Ghost",
    type: "ghost",
    createdAt: serverTimestamp()
  });
  playScream();
  heavySanityDrain();
  spikeEMF();
  flickerScreen();
}

// === Show sanity % number ===

// ==== EMF Spike ====
function spikeEMF(){
  const meter = document.getElementById("emfMeter");
  if(!meter) return;
  meter.textContent = "EMF 5";
  meter.style.color = "red";
  meter.classList.add("emf-spike");
  setTimeout(()=>{
    meter.textContent = "EMF 2";
    meter.style.color = "#38bdf8";
    meter.classList.remove("emf-spike");
  }, 2000);
}, 2000);
}

// ==== Flicker Screen ====
function flickerScreen(){
  const body=document.body;
  body.style.filter="brightness(40%)";
  setTimeout(()=>{ body.style.filter="brightness(100%)"; }, 300);
}

// hook sanity drain on normal chat too

document.addEventListener("DOMContentLoaded", () => {
  const { room, name } = getParams();

  setupChat(room, name);
  listenTyping(room, name);
  setupRoomChips(room, name);

  // System "joined" message (best-effort; may fire on reload)
  sendSystemMessage(room, name + " entered the room.").catch(() => {});

  const amb = document.getElementById("van-ambient");
  if (amb) {
    amb.loop = false;
    amb.play().catch(() => {});
  }

  const btn = document.getElementById("openRoomBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const url = "https://meet.jit.si/PhasmaBroads-" + encodeURIComponent(room);
      const join = document.getElementById("join-sfx");
      const hunt = document.getElementById("hunt-sfx");
      if (join) { join.currentTime = 0; join.play().catch(() => {}); }
      if (hunt) { hunt.currentTime = 0; hunt.play().catch(() => {}); }
      window.open(url, "_blank");
    });
  }

  const back = document.getElementById("backToLobby");
  if (back) {
    back.addEventListener("click", () => (window.location.href = "index.html"));
  }
});
