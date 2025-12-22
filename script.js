const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

// ===== CONFIG =====
const PARTICLE_COUNT = 320;
const CENTER_RADIUS = 160;
const FRICTION = 0.82;
const MAX_SPEED = 4;

// რეჟიმები
let mode = "FLOW"; // FLOW | FORM_TEXT | HOLD | DISPERSE
let timer = 0;
let textPoints = [];

// ===== RESIZE =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  textPoints = generateTextPoints("MuYuDo");
}
window.addEventListener("resize", resize);

// ===== CENTER =====
const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

// ===== PARTICLES =====
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    r: Math.random() * 2 + 1
  });
}

resize();

// ===== ANIMATION =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {

    if (mode === "FORM_TEXT" && textPoints[i]) {
      const tx = textPoints[i].x;
      const ty = textPoints[i].y;
      p.vx += (tx - p.x) * 0.08;
      p.vy += (ty - p.y) * 0.08;
    }

    else if (mode === "HOLD") {
      p.vx *= 0.7;
      p.vy *= 0.7;
    }

    else if (mode === "DISPERSE") {
      p.vx += (Math.random() - 0.5) * 0.6;
      p.vy += (Math.random() - 0.5) * 0.6;
    }

    else {
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist > CENTER_RADIUS) {
        p.vx += dx * 0.00002;
        p.vy += dy * 0.00002;
      }
    }

    // MOVE
    p.x += p.vx;
    p.y += p.vy;

    // FRICTION + LIMIT
    p.vx *= FRICTION;
    p.vy *= FRICTION;
    p.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vx));
    p.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, p.vy));

    // DRAW PARTICLE
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowColor = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 12;
    ctx.fill();

    // LINES only in FLOW
    if (mode === "FLOW") {
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,255,255,${1 - d / 110})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  });

  // ===== TIMELINE =====
  timer++;

  if (timer === 200) mode = "FORM_TEXT";
  if (timer === 360) mode = "HOLD";
  if (timer === 480) mode = "DISPERSE";
  if (timer === 680) {
    mode = "FLOW";
    timer = 0;
  }

  requestAnimationFrame(animate);
}

// ===== TEXT POINTS =====
function generateTextPoints(text) {
  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = canvas.width;
  temp.height = canvas.height;

  tctx.fillStyle = "white";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";
  tctx.font = "bold 140px Arial";

  tctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const img = tctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pts = [];

  for (let y = 0; y < canvas.height; y += 5) {
    for (let x = 0; x < canvas.width; x += 5) {
      const i = (y * canvas.width + x) * 4;
      if (img[i + 3] > 150) pts.push({ x, y });
    }
  }

  return pts.slice(0, PARTICLE_COUNT);
}

// START
animate();


