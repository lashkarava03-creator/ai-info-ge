const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");
const stones = document.querySelector(".stones");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ===== SETTINGS =====
const PARTICLE_COUNT = 220;
const TEXT = "AI";
const FORM_SPEED = 0.08;
const FLOAT_SPEED = 0.4;

// ===== STATE =====
let mode = "FLOAT"; // FLOAT | FORM | DISPERSE
let timer = 0;
let textPoints = [];

// ===== PARTICLES =====
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * FLOAT_SPEED,
    vy: (Math.random() - 0.5) * FLOAT_SPEED,
    r: 2
  });
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
  tctx.font = "bold 160px Arial";
  tctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = tctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

textPoints = generateTextPoints(TEXT);

// ===== ANIMATION =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    if (mode === "FORM" && textPoints[i]) {
      p.x += (textPoints[i].x - p.x) * FORM_SPEED;
      p.y += (textPoints[i].y - p.y) * FORM_SPEED;
    } else {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,1)";
    ctx.shadowColor = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.fill();
  });

  // ===== TIMELINE =====
  timer++;

  if (timer === 180) {
    mode = "FORM";
    if (stones) stones.classList.add("ai-mode");
  }

  if (timer === 420) {
    mode = "DISPERSE";
    if (stones) stones.classList.remove("ai-mode");
  }

  if (timer === 520) {
    mode = "FLOAT";
  }

  if (timer > 700) timer = 0;

  requestAnimationFrame(animate);
}

// 🔥 სტარტი — ერთხელ
animate();
