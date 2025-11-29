
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

  // play ambient van hum immediately on this screen
  const vanAmbient = document.getElementById("van-ambient");
  if (vanAmbient) {
    vanAmbient.volume = 0.25;
    vanAmbient.play().catch(() => {});
  }

  const openBtn = document.getElementById("openRoomBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const url = "https://meet.jit.si/PhasmaBroads-" + encodeURIComponent(room);
      // play hunt sting when they open the room
      const hunt = document.getElementById("hunt-sfx");
      if (hunt) { hunt.currentTime = 0; hunt.play().catch(() => {}); }
      window.open(url, "_blank");
    });
  }
});
