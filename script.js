const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let textPoints = [];
let mode = "FLOW";
let timer = 0;

const PARTICLE_COUNT = 180;
const center = { x: 0, y: 0 };

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  textPoints = generateTextPoints("AI");
}

window.addEventListener("resize", resize);
resize();

// ნაწილაკები
particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.6,
  vy: (Math.random() - 0.5) * 0.6,
  r: Math.random() * 2 + 1
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (mode === "TEXT" && textPoints[i]) {
      p.vx += (textPoints[i].x - p.x) * 0.015;
      p.vy += (textPoints[i].y - p.y) * 0.015;
    }

    if (mode === "FLOW") {
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      p.vx += dx * 0.00001;
      p.vy += dy * 0.00001;
    }

    p.x += p.vx;
    p.y += p.vy;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
  });

  timer++;

  if (timer === 200) mode = "TEXT";     // იკრიბება AI
  if (timer === 520) mode = "FLOW";     // იშლება
  if (timer > 750) timer = 0;

  requestAnimationFrame(animate);
}

function generateTextPoints(text) {
  const tempCanvas = document.createElement("canvas");
  const tctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  tctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tctx.font = "bold 140px Arial";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.fillStyle = "white";
  tctx.fillText(text, center.x, center.y - 40);

  const imgData = tctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const points = [];

  for (let y = 0; y < tempCanvas.height; y += 6) {
    for (let x = 0; x < tempCanvas.width; x += 6) {
      const index = (y * tempCanvas.width + x) * 4;
      if (imgData.data[index + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

animate();
