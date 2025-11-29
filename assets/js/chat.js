import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } 
from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2WA7yotRlqNidwIgJcT19JNrK8ukMgs4",
  authDomain: "phasmophobiabroads.firebaseapp.com",
  projectId: "phasmophobiabroads",
  storageBucket: "phasmophobiabroads.firebasestorage.app",
  messagingSenderId: "503659624108",
  appId: "1:503659624108:web:6e57fbc6bf36b0d5989109"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getParams(){
  const p=new URLSearchParams(window.location.search);
  return {room:p.get("room")||"BROADSVAN",name:p.get("name")||"Investigator"};
}

function append(msg,me){
  let box=document.getElementById("chatMessages");
  if(!box) return;
  let row=document.createElement("div");
  row.className="chat-message";
  row.innerHTML=`<span class="chat-name">${msg.name||"Investigator"}:</span> ${msg.text||""}`;
  box.appendChild(row);
  box.scrollTop=box.scrollHeight;
}

function setup(room,name){
  const form=document.getElementById("chatForm");
  const input=document.getElementById("chatInput");
  const list=document.getElementById("chatMessages");
  const ref=collection(db,"rooms",room.toUpperCase(),"messages");
  const q=query(ref,orderBy("createdAt"));
  onSnapshot(q,s=>{
    list.innerHTML="";
    s.forEach(doc=>append(doc.data(),name));
    list.scrollTop=list.scrollHeight;
  });
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    let t=input.value.trim();
    if(!t) return;
    input.value="";
    await addDoc(ref,{text:t,name,createdAt:serverTimestamp()});
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  const {room,name}=getParams();
  setup(room,name);
  let amb=document.getElementById("van-ambient");
  if(amb){amb.loop=false;amb.play().catch(()=>{});}
  let btn=document.getElementById("openRoomBtn");
  if(btn){
    btn.addEventListener("click",()=>{
      const url="https://meet.jit.si/PhasmaBroads-"+encodeURIComponent(room);
      let j=document.getElementById("join-sfx"); if(j){j.currentTime=0;j.play().catch(()=>{});}
      let h=document.getElementById("hunt-sfx"); if(h){h.currentTime=0;h.play().catch(()=>{});}
      window.open(url,"_blank");
    });
  }
  let back=document.getElementById("backToLobby");
  if(back){back.addEventListener("click",()=>window.location.href="index.html");}
});
