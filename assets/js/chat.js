
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

function appendChatMessage(name, text) {
  const list = document.getElementById("chatMessages");
  if (!list) return;
  const row = document.createElement("div");
  row.className = "chat-message";

  const nameSpan = document.createElement("span");
  nameSpan.className = "chat-name";
  nameSpan.textContent = name + ":";

  const textSpan = document.createElement("span");
  textSpan.textContent = " " + text;

  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  list.appendChild(row);
  list.scrollTop = list.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const { room, name, avatar } = getParams();

  const roomLabel = document.getElementById("room-label");
  const nameLabel = document.getElementById("player-label");
  if (roomLabel) roomLabel.textContent = room;
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

  const openBtn = document.getElementById("openRoomBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const url = "https://meet.jit.si/PhasmaBroads-" + encodeURIComponent(room);

      // entry / hunt sounds
      const joinSfx = document.getElementById("join-sfx");
      if (joinSfx) { joinSfx.currentTime = 0; joinSfx.play().catch(() => {}); }

      const hunt = document.getElementById("hunt-sfx");
      if (hunt) { hunt.currentTime = 0; hunt.play().catch(() => {}); }

      window.open(url, "_blank");
    });
  }

  // simple local van chat (not networked)
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendChatMessage(name, text);
      chatInput.value = "";
    });
  }
});
