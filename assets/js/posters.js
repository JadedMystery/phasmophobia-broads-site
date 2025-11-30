
const posterFolder = "assets/images/posters/";
const posterFiles = ["poster1.png","poster2.png","poster3.png","poster4.png","poster5.png","poster6.png"];

let current = 0;

function loadPosters(){
    const wall = document.getElementById("posterWall");
    wall.innerHTML = "";
    posterFiles.forEach((p,i)=>{
        const div = document.createElement("div");
        div.className="poster";
        div.style.backgroundImage = `url('${posterFolder}${p}')`;
        div.style.opacity = (i===current) ? 1 : 0;
        wall.appendChild(div);
    });
}

function rotatePosters(){
    current = (current + 1) % posterFiles.length;
    const posters = document.querySelectorAll(".poster");
    posters.forEach((p,i)=>{
        p.style.opacity = (i===current) ? 1 : 0;
    });
}

window.onload = ()=>{
    loadPosters();
    setInterval(rotatePosters, 10000);
};
