const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  textPoints = generateTextPoints("AI");
}
window.addEventListener("resize", resize);
resize();

// --- პარამეტრები ---
const dots = [];
const DOT_COUNT = 180;
let textPoints = [];
let forming = false;
let frame = 0;

// --- წერტილების შექმნა ---
for (let i = 0; i < DOT_COUNT; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    target: null
  });
}

// --- AI ტექსტის წერტილებად გადაყვანა ---
function generateTextPoints(text) {
  const tCanvas = document.createElement("canvas");
  const tctx = tCanvas.getContext("2d");

  tCanvas.width = canvas.width;
  tCanvas.height = canvas.height;

  tctx.clearRect(0, 0, tCanvas.width, tCanvas.height);
  tctx.fillStyle = "white";
  tctx.font = "bold 110px Arial";
  tctx.textAlign = "center";
  tctx.textBaseline = "middle";

  tctx.fillText(text, tCanvas.width / 2, tCanvas.height / 2 - 40);

  const data = tctx.getImageData(0, 0, tCanvas.width, tCanvas.height).data;
  const points = [];

  for (let y = 0; y < tCanvas.height; y += 6) {
    for (let x = 0; x < tCanvas.width; x += 6) {
      const i = (y * tCanvas.width + x) * 4;
      if (data[i + 3] > 150) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

// --- მიზნების მინიჭება ---
function assignTargets() {
  dots.forEach(dot => {
    dot.target = textPoints[Math.floor(Math.random() * textPoints.length)];
  });
}

// --- მთავარი ანიმაცია ---
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    if (forming && dot.target) {
      dot.vx += (dot.target.x - dot.x) * 0.004;
      dot.vy += (dot.target.y - dot.y) * 0.004;
    }

    dot.vx *= 0.9;
    dot.vy *= 0.9;

    dot.x += dot.vx;
    dot.y += dot.vy;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,255,255,0.9)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.fill();
  });

  frame++;

  // ~3 წამში იწყებს AI-ს ფორმირებას
  if (frame === 180) {
    assignTargets();
    forming = true;
  }

  requestAnimationFrame(animate);
}

animate();
