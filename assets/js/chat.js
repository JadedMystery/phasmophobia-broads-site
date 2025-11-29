
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

function initJitsi(room, name, avatar) {
  if (typeof JitsiMeetExternalAPI === "undefined") {
    const status = document.getElementById("monitor-status");
    if (status) status.textContent = "ERROR: Jitsi API not loaded";
    return;
  }

  const domain = "meet.jit.si";
  const container = document.getElementById("jitsi-container");
  if (!container) return;

  const options = {
    roomName: "PhasmaBroads-" + room,
    parentNode: container,
    userInfo: {
      displayName: name
      // avatarURL: avatar || undefined  // data URLs may or may not be supported; overlay handles visuals
    },
    configOverwrite: {
      prejoinPageEnabled: false,
      disableDeepLinking: true
    },
    interfaceConfigOverwrite: {
      TILE_VIEW_MAX_COLUMNS: 4,
      SHOW_JITSI_WATERMARK: false
    }
  };

  const api = new JitsiMeetExternalAPI(domain, options);
  const status = document.getElementById("monitor-status");
  if (status) status.textContent = "Connected: " + room;

  return api;
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

  // small delay so layout settles before embedding Jitsi
  setTimeout(() => {
    initJitsi(room, name, avatar);
  }, 400);
});
