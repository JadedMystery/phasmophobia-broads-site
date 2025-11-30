
const scenes=[
 'assets/img/camera/scene_1.png',
 'assets/img/camera/scene_2.png',
 'assets/img/camera/scene_3.png',
 'assets/img/camera/scene_4.png',
 'assets/img/camera/scene_5.png',
 'assets/img/camera/scene_6.png'
];
let idx=0;
setInterval(()=>{
 idx=(idx+1)%scenes.length;
 let L=document.getElementById('cctvLobby');
 if(L) L.src=scenes[idx];
 let V=document.getElementById('cctvVan');
 if(V) V.src=scenes[idx];
},5000);
