
document.getElementById("sendBtn").onclick = () => {
  const msg = document.getElementById("chatInput").value;
  if(!msg) return;
  const box = document.getElementById("messages");
  const line = document.createElement("div");
  line.textContent = "> " + msg;
  box.appendChild(line);
  document.getElementById("chatInput").value = "";
};
