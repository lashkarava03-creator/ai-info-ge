const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ნაწილაკები
const particles = [];
const COUNT = 140;

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach((p,i)=>{
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x,p.y,1.6,0,Math.PI*2);
    ctx.fillStyle="rgba(0,255,255,0.9)";
    ctx.fill();

    for (let j=i+1;j<particles.length;j++){
      const p2=particles[j];
      const d=Math.hypot(p.x-p2.x,p.y-p2.y);
      if(d<120){
        ctx.strokeStyle=`rgba(0,255,255,${1-d/120})`;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();

/* ქვების ანიმაცია */
const stones = document.querySelectorAll(".stone");

function showStones() {
  stones.forEach(s => {
    s.style.opacity = "1";
  });
}

function hideStones() {
  stones.forEach(s => {
    s.style.opacity = "0";
    s.style.transform = "translate(-50%, -50%)";
  });
}

function animateStones() {
  showStones();

  stones[0].style.transform = "translate(-120px, -80px)";
  stones[1].style.transform = "translate(-70px, -140px)";
  stones[2].style.transform = "translate(120px, -80px)";
  stones[3].style.transform = "translate(70px, -140px)";
  stones[4].style.transform = "translate(0px, -170px)";

  setTimeout(hideStones, 6000);
}

animateStones();
setInterval(animateStones, 120000);

