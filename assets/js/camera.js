const scenes=[
  "assets/img/camera/scene_1.png",
  "assets/img/camera/scene_2.png",
  "assets/img/camera/scene_3.png",
  "assets/img/camera/scene_4.png",
  "assets/img/camera/scene_5.png",
  "assets/img/camera/scene_6.png"
];
let idx=0;
setInterval(()=>{
  idx=(idx+1)%scenes.length;
  document.getElementById("cameraFeed").src=scenes[idx];
},6000);
