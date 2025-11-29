
const tips = [
  "Tip: Don’t die. It’s embarrassing.",
  "Tip: If the EMF hits 5, that’s your problem now.",
  "Tip: Screaming is a valid communication style.",
  "Tip: If you hear footsteps behind you... that wasn’t me.",
  "Tip: Turning on too many lights can trip the breaker.",
  "Tip: Some ghosts respond more when you are alone.",
  "Tip: Hide behind furniture during a hunt and turn off your electronics.",
  "Tip: Keep track of sanity – brave doesn’t mean invincible.",
  "Tip: If she stays in the truck again, drag her OUT of it.",
  "Tip: The voodoo doll is NOT a toy. She’ll still poke it.",
  "Tip: Whoever summoned the ghost can explain it to the group.",
  "Tip: If you hear your name whispered... run, babe.",
  "Tip: The van is safe. Usually.",
  "Tip: The ghost wants your wig. Hold it tight.",
  "Tip: If the door closes by itself, that’s your sign to leave."
];

function setRandomTip() {
  const tipEl = document.getElementById("ghost-tip");
  if (!tipEl) return;
  const tip = tips[Math.floor(Math.random() * tips.length)];
  tipEl.textContent = tip;
}

function showLobby() {
  const loading = document.getElementById("loading-screen");
  const lobby = document.getElementById("lobby-screen");
  if (loading) loading.classList.add("hidden");
  if (lobby) lobby.classList.remove("hidden");
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function goToChat(roomCode, playerName) {
  const params = new URLSearchParams();
  params.set("room", roomCode);
  params.set("name", playerName);
  window.location.href = "chat.html?" + params.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  // rotate tips during loading screen
  setRandomTip();
  const tipInterval = setInterval(setRandomTip, 5000);

  // fake loading
  setTimeout(() => {
    clearInterval(tipInterval);
    showLobby();
  }, 4000);

  const createBtn = document.getElementById("createLobbyBtn");
  const joinBtn = document.getElementById("joinLobbyBtn");
  const randomBtn = document.getElementById("randomCodeBtn");
  const nameInput = document.getElementById("playerName");
  const roomInput = document.getElementById("roomCode");

  function getValues() {
    let name = (nameInput && nameInput.value.trim()) || "Investigator";
    let room = (roomInput && roomInput.value.trim().toUpperCase()) || "";
    return { name, room };
  }

  if (randomBtn && roomInput) {
    randomBtn.addEventListener("click", () => {
      const code = generateRoomCode();
      roomInput.value = code;
      roomInput.focus();
      roomInput.select();
    });
  }

  if (createBtn) {
    createBtn.addEventListener("click", () => {
      const vals = getValues();
      if (!vals.room) {
        vals.room = generateRoomCode();
        if (roomInput) roomInput.value = vals.room;
      }
      goToChat(vals.room, vals.name);
    });
  }

  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      const vals = getValues();
      if (!vals.room) {
        alert("Enter a room code or click Random Room Code first.");
        return;
      }
      goToChat(vals.room, vals.name);
    });
  }
});
