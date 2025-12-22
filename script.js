const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  textPoints = generateTextPoints("AI");
}
window.addEventListener("resize", resize);
resize();

// ------------------
// პარამეტრები
// ------------------
const PARTICLE_COUNT = 160;
const CONNECT_DIST = 120;

let mode = "GATHER"; // GATHER → FORM → DISPERSE
let timer = 0;

let textPoints = [];

// ------------------
// ნაწილაკები
// ------------------
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: 0,
    vy: 0,
    r: Math.random() * 2 + 1.5
  });
}

// ------------------
// ანიმაცია
// ------------------
function animate() {
  ctx.clearRect(0, 0, W, H);

  particles.forEach((p, i) => {
    let tx = W / 2;
    let ty = H / 2;

    if (mode === "FORM" && textPoints[i]) {
      tx = textPoints[i].x;
      ty = textPoints[i].y;
    }

    if (mode === "DISPERSE") {
      p.vx += (Math.random() - 0.5) * 0.4;
      p.vy += (Math.random() - 0.5) * 0.4;
    } else {
      const dx = tx - p.x;
      const dy = ty - p.y;
      p.vx += dx * 0.004;
      p.vy += dy * 0.004;
    }

    // დამშვიდება (სწორედ ეს ხსნის ჭედვას)
    p.vx *= 0.88;
    p.vy *= 0.88;

    p.x += p.vx;
    p.y += p.vy;

    // წერტილი
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.fill();

    // ხაზები
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const d = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (d < CONNECT_DIST) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0,255,255,${1 - d / CONNECT_DIST})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  });

  // ------------------
  // ეტაპების ლოგიკა
  // ------------------
  timer++;

  if (timer < 200) mode = "GATHER";
  else if (timer < 420) mode = "FORM";
  else if (timer < 620) mode = "DISPERSE";
  else timer = 0;

  requestAnimationFrame(animate);
}

// ------------------
// ტექსტის წერტილები
// ------------------
function generateTextPoints(text) {
  const tCanvas = document.createElement("canvas");
  const tCtx = tCanvas.getContext("2d");

  tCanvas.width = W;
  tCanvas.height = H;

  tCtx.fillStyle = "white";
  tCtx.textAlign = "center";
  tCtx.textBaseline = "middle";
  tCtx.font = "bold 160px Arial";
  tCtx.fillText(text, W / 2, H / 2);

  const img = tCtx.getImageData(0, 0, W, H);
  const points = [];

  for (let y = 0; y < H; y += 6) {
    for (let x = 0; x < W; x += 6) {
      const a = img.data[(y * W + x) * 4 + 3];
      if (a > 150) points.push({ x, y });
    }
  }
  return points;
}

animate();




