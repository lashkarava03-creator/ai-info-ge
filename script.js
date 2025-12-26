const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let textPoints = [];
let mode = "FLOW";
let timer = 0;

const count = 140;
const center = { x: 0, y: 0 };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  textPoints = makeText("AI");
}

window.addEventListener("resize", resize);
resize();

for (let i = 0; i < count; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach((p,i)=>{
    if (mode === "TEXT" && textPoints[i]) {
      p.vx += (textPoints[i].x - p.x) * 0.01;
      p.vy += (textPoints[i].y - p.y) * 0.01;
    }

    p.x += p.vx;
    p.y += p.vy;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
  });

  timer++;
  if (timer === 200) mode = "TEXT";
  if (timer === 500) mode = "FLOW";
  if (timer > 700) timer = 0;

  requestAnimationFrame(animate);
}

function makeText(text){
  const t = document.createElement("canvas");
  const c = t.getContext("2d");
  t.width = canvas.width;
  t.height = canvas.height;

  c.font = "bold 140px Arial";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, center.x, center.y);

  const data = c.getImageData(0,0,t.width,t.height).data;
  const pts = [];

  for(let y=0;y<t.height;y+=6){
    for(let x=0;x<t.width;x+=6){
      const i=(y*t.width+x)*4;
      if(data[i+3]>150) pts.push({x,y});
    }
  }
  return pts;
}

animate();
