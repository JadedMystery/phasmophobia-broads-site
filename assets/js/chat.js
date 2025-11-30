
function sendMsg(){
    const i = document.getElementById("chatInput");
    const msg = i.value;
    if(!msg) return;
    const box = document.getElementById("messages");
    const div = document.createElement("div");
    div.textContent = "> " + msg;
    box.appendChild(div);
    i.value="";
}
