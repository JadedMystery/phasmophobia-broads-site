
const scenes = [
  "assets/img/camera/scene_1.png",
  "assets/img/camera/scene_2.png",
  "assets/img/camera/scene_3.png",
  "assets/img/camera/scene_4.png",
  "assets/img/camera/scene_5.png",
  "assets/img/camera/scene_6.png"
];

let camIndex = 0;
const imgEl = document.getElementById("cctvImage");
const prevBtn = document.getElementById("prevCam");
const nextBtn = document.getElementById("nextCam");

function updateCam() {
  if (!imgEl) return;
  imgEl.src = scenes[camIndex];
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    camIndex = (camIndex - 1 + scenes.length) % scenes.length;
    updateCam();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    camIndex = (camIndex + 1) % scenes.length;
    updateCam();
  });
}

// initial set
updateCam();
