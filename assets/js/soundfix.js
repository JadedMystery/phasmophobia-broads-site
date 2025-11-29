
const amb=document.getElementById('ambient');
if(amb){
 amb.loop=false;
 amb.addEventListener('ended',()=>{
   amb.pause();
   amb.currentTime=0;
 });
}
