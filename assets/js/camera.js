
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
  let l=document.getElementById("cctvLobby");
  if(l) l.src=scenes[idx];
  let v=document.getElementById("cctvVan");
  if(v) v.src=scenes[idx];
},5000);
