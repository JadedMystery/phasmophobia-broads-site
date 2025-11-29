
function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    room: params.get("room") || "BROADSVAN",
    name: params.get("name") || "Investigator"
  };
}

function initJitsi(room, name) {
  if (typeof JitsiMeetExternalAPI === "undefined") {
    console.error("Jitsi external API not loaded.");
    const status = document.getElementById("monitor-status");
    if (status) status.textContent = "ERROR: JITSI NOT LOADED";
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
    },
    configOverwrite: {
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
  const { room, name } = getParams();

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

  initJitsi(room, name);
});
