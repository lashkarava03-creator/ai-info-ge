const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let textPoints = [];
let mode = "FLOAT";

const PARTICLE_COUNT = 300;

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      size: 2,
      target: null
    });
  }
}

function generateTextPoints() {
  const temp = document.createElement("canvas");
  const tctx = temp.getContext("2d");

  temp.width = canvas.width;
  temp.height = canvas.height;

  tctx.clearRect(0, 0, temp.width, temp.height);

  // ⚠️ ძალიან მნიშვნელოვანია
  tctx.fillStyle = "white";
  tctx.font = "bold 160px sans-serif";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";

  tctx.fillText("AI", temp.width / 2, temp.height / 2);

  const img = tctx.getImageData(0, 0, temp.width, temp.height).data;
  textPoints = [];

  for (let y = 0; y < temp.height; y += 4) {
    for (let x = 0; x < temp.width; x += 4) {
      const index = (y * temp.width + x) * 4 + 3;
      if (img[index] > 150) {
        textPoints.push({ x, y });
      }
    }
  }

  // 👇 ეს ხაზია კრიტიკული
  console.log("TEXT POINTS:", textPoints.length);
}

function assignTargets() {
  particles.forEach(p => {
    p.target = textPoints[Math.floor(Math.random() * textPoints.length)];
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    if (mode === "TEXT" && p.target) {
      p.vx += (p.target.x - p.x) * 0.004;
      p.vy += (p.target.y - p.y) * 0.004;
    } else {
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;
    }

    p.x += p.vx;
    p.y += p.vy;
    
    p.vx *= 0.85;
    p.vy *= 0.85;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// --- INIT ---
createParticles();
generateTextPoints();
assignTargets();
mode = "TEXT";
animate();

