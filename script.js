const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  textPoints = generateTextPoints("AI");
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const PARTICLE_COUNT = 420;
let textPoints = [];

// ნაწილაკების შექმნა
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: 0,
    vy: 0,
    r: 1.6
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (textPoints[i]) {
      const tx = textPoints[i].x;
      const ty = textPoints[i].y;

      p.vx += (tx - p.x) * 0.004;
      p.vy += (ty - p.y) * 0.004;
    }

    p.vx *= 0.88;
    p.vy *= 0.88;

    p.x += p.vx;
    p.y += p.vy;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,0.95)";
    ctx.shadowColor = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 14;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

function generateTextPoints(text) {
  const tCanvas = document.createElement("canvas");
  const tctx = tCanvas.getContext("2d");

  tCanvas.width = canvas.width;
  tCanvas.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.font = "bold 92px Arial";
  tctx.shadowColor = "rgba(0,255,255,1)";
  tctx.shadowBlur = 22;

  tctx.fillText(text, tCanvas.width / 2, tCanvas.height / 2);

  const data = tctx.getImageData(0, 0, tCanvas.width, tCanvas.height).data;
  const points = [];

  for (let y = 0; y < tCanvas.height; y += 5) {
    for (let x = 0; x < tCanvas.width; x += 5) {
      const i = (y * tCanvas.width + x) * 4;
      if (data[i + 3] > 160) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

animate();
